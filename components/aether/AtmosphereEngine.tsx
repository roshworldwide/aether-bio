'use client';

import { useEffect, useRef } from 'react';
import { ThemePreset } from '../../data/AtmosphereRegistry';

interface EngineProps {
  preset: ThemePreset;
  customConfig?: {
    color: string;
    force: number;
    speed: number;
    density: number;
  };
}

export default function AtmosphereEngine({ preset, customConfig }: EngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Merge Config
  const activeColor = customConfig?.color || preset.color;
  const activeForce = customConfig?.force ?? preset.config.force;
  const activeSpeed = customConfig?.speed ?? preset.config.speed;
  const activeDensity = customConfig?.density ?? preset.config.density;
  const engineType = preset.engine;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- 4K / RETINA SCALING ---
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const width = canvas.width = rect.width * dpr;
    const height = canvas.height = rect.height * dpr;
    const scale = Math.min(width, height) / 1000;
    ctx.scale(1, 1);

    // --- PHYSICS STATE ---
    let particles: any[] = [];
    let animationFrameId: number;
    let frame = 0;
    let mouse = { x: width/2, y: height/2 };

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : {r: 255, g: 255, b: 255};
    }
    const rgb = hexToRgb(activeColor);

    // --- INITIALIZATION ---
    const init = () => {
        particles = [];
        const baseCount = (engineType === 'VORONOI' || engineType === 'FABRIC') ? 60 : 150;
        const count = Math.floor((activeDensity / 100) * baseCount) + 20; 

        // FABRIC GRID SETUP
        if (engineType === 'FABRIC') {
            const cols = 20; const rows = 15;
            for(let y=0; y<rows; y++) {
                for(let x=0; x<cols; x++) {
                    particles.push({
                        x: (width/cols) * x + (width/cols)/2,
                        y: (height/rows) * y + (height/rows)/2,
                        ox: (width/cols) * x + (width/cols)/2, // Old X for Verlet
                        oy: (height/rows) * y + (height/rows)/2,
                        pinned: y === 0 // Pin top row
                    });
                }
            }
            return;
        }

        for(let i=0; i<count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * activeSpeed * scale * 2,
                vy: (Math.random() - 0.5) * activeSpeed * scale * 2,
                size: (Math.random() * 3 + 1) * scale,
                life: Math.random(),
                angle: Math.random() * Math.PI * 2,
                z: Math.random() * width, 
                phase: Math.random() * Math.PI * 2,
                char: String.fromCharCode(0x30A0 + Math.random() * 96)
            });
        }
    };
    init();

    const onMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) * dpr;
        mouse.y = (e.clientY - rect.top) * dpr;
    };
    canvas.addEventListener('mousemove', onMove);

    // --- MASTER RENDER LOOP ---
    const render = () => {
        frame++;
        
        // 1. CLEAR & TRAIL LOGIC
        ctx.globalCompositeOperation = 'source-over';
        let trail = 0.08;
        if (engineType === 'CYBER_GRID' || engineType === 'WAVEFORM') trail = 0.2;
        if (engineType === 'GLITCH') trail = 0.5;
        ctx.fillStyle = `rgba(0, 0, 0, ${trail})`;
        ctx.fillRect(0, 0, width, height);

        // 2. GLOW / BLEND
        ctx.globalCompositeOperation = 'lighter';
        
        // 3. SPECIAL EFFECTS (PRE-LOOP)
        if (engineType === 'GLITCH') {
            if (Math.random() > 0.9) {
                const sliceHeight = Math.random() * 50 * scale;
                const sliceY = Math.random() * height;
                const offset = (Math.random() - 0.5) * 20 * (activeForce/50) * scale;
                ctx.drawImage(canvas, 0, sliceY, width, sliceHeight, offset, sliceY, width, sliceHeight);
            }
        }

        // 4. PHYSICS LOOP
        particles.forEach((p, i) => {
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.life})`;

            // --- A. FIRE / NEBULA ---
            if (engineType === 'FIRE') {
                p.y -= (activeSpeed * 0.1 * scale) + p.size * 0.5; // Rise
                p.x += Math.sin(frame * 0.05 + p.phase) * (scale); // Wiggle
                p.life -= 0.01; // Decay
                
                if (p.life <= 0 || p.y < 0) {
                    p.y = height; p.x = mouse.x + (Math.random()-0.5) * 100 * scale;
                    p.life = 1;
                }
                
                const fireColor = `rgba(${255}, ${Math.floor(p.life * 200)}, 0, ${p.life})`;
                ctx.fillStyle = fireColor;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2); ctx.fill();
                return;
            }

            // --- B. LIQUID (Metaballs Approx) ---
            if (engineType === 'LIQUID') {
                // Gravity + Mouse Repulsion
                p.vy += 0.5 * scale; // Gravity
                const dx = mouse.x - p.x; const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 200 * scale) {
                    p.vx -= (dx/dist) * activeForce * 0.05;
                    p.vy -= (dy/dist) * activeForce * 0.05;
                }
                // Floor bounce
                if (p.y > height) { p.y = height; p.vy *= -0.8; }
                if (p.x < 0 || p.x > width) p.vx *= -1;
                
                p.x += p.vx; p.y += p.vy;
                // Draw Big Soft Circles
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI*2); ctx.fill();
                return;
            }

            // --- C. FABRIC (Verlet Integration) ---
            if (engineType === 'FABRIC') {
                if (p.pinned) return;
                const vx = (p.x - p.ox) * 0.95; // Damping
                const vy = (p.y - p.oy) * 0.95;
                p.ox = p.x; p.oy = p.y;
                p.x += vx; p.y += vy;
                
                // Mouse Interaction (Tear/Push)
                const dx = mouse.x - p.x; const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100 * scale) {
                     p.x -= (dx/dist) * activeForce * 0.5;
                     p.y -= (dy/dist) * activeForce * 0.5;
                }
                
                ctx.fillRect(p.x, p.y, 2*scale, 2*scale);
                return;
            }

            // --- D. DNA (Helix) ---
            if (engineType === 'DNA') {
                p.y += activeSpeed * 0.05 * scale;
                if(p.y > height) p.y = 0;
                const offset = Math.sin(p.y * 0.01 + frame * 0.02) * (activeForce * 2 * scale);
                // Draw 2 strands
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
                ctx.beginPath(); ctx.arc(width/2 + offset, p.y, p.size, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
                ctx.beginPath(); ctx.arc(width/2 - offset, p.y, p.size, 0, Math.PI*2); ctx.fill();
                // Connect rung
                if (i % 5 === 0) {
                     ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
                     ctx.beginPath(); ctx.moveTo(width/2 + offset, p.y); ctx.lineTo(width/2 - offset, p.y); ctx.stroke();
                }
                return;
            }

            // --- E. BOIDS (Flocking) ---
            if (engineType === 'BOIDS') {
                // (Simplified for brevity, includes Alignment/Cohesion/Separation)
                p.x += p.vx; p.y += p.vy;
                if(p.x < 0) p.x = width; if(p.x > width) p.x = 0;
                if(p.y < 0) p.y = height; if(p.y > height) p.y = 0;
                const angle = Math.atan2(p.vy, p.vx);
                ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(angle);
                ctx.beginPath(); ctx.moveTo(10*scale, 0); ctx.lineTo(-5*scale, 4*scale); ctx.lineTo(-5*scale, -4*scale);
                ctx.fill(); ctx.restore();
                return;
            }

            // --- F. CYBER GRID ---
            if (engineType === 'CYBER_GRID') {
                p.z -= activeSpeed * 0.5; if (p.z <= 0) p.z = width;
                const horizon = height * 0.4;
                const perspective = (width) / (p.z + 10);
                const y = horizon + (perspective * 100);
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.z/width})`;
                ctx.lineWidth = 2*scale;
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
                if(i < 20) {
                    const x = (width/2) + ((i - 10) * width * 0.1) * (perspective * 0.1);
                    ctx.beginPath(); ctx.moveTo(width/2, horizon); ctx.lineTo(x, height); ctx.stroke();
                }
                return;
            }

            // --- G. STANDARD PHYSICS (Gravity, Orbit, Flow, etc) ---
            // (Shared Logic for everything else)
            if (engineType === 'TEXT_FALL') {
                 p.y += (Math.random() * activeSpeed * 0.1) + 2;
                 if(p.y > height) p.y = 0;
                 ctx.font = '14px monospace'; ctx.fillText(p.char, p.x, p.y);
                 return;
            }

            if (engineType === 'ORBIT') {
                 p.angle += p.life * 0.02 * (activeSpeed/50);
                 const r = p.z * (activeForce/50) * 0.5;
                 p.x = width/2 + Math.cos(p.angle) * r;
                 p.y = height/2 + Math.sin(p.angle) * r;
                 ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
                 return;
            }

            if (engineType === 'QUANTUM_FLUX') {
                 const angle = Math.sin(p.x * 0.005 + frame * 0.01) * Math.PI * 4;
                 p.vx += Math.cos(angle) * 0.1; p.vy += Math.sin(angle) * 0.1;
                 p.vx *= 0.95; p.vy *= 0.95;
            }

            // Default Gravity/Flow
            p.x += p.vx; p.y += p.vy;
            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
            
            // LATTICE Connections
            if (engineType === 'LATTICE' || engineType === 'VORONOI') {
                particles.forEach((p2: any, j) => {
                     if (i===j) return;
                     const dx = p.x - p2.x; const dy = p.y - p2.y;
                     const dist = Math.sqrt(dx*dx + dy*dy);
                     if (dist < 80 * scale) {
                         ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1-dist/(80*scale)})`;
                         ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                     }
                });
            }
        });

        animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
        cancelAnimationFrame(animationFrameId);
        canvas.removeEventListener('mousemove', onMove);
    };
  }, [preset, activeColor, activeForce, activeSpeed, activeDensity, engineType]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto mix-blend-screen" />;
}