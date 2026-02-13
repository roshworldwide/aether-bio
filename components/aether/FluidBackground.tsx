'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  targetSize: number;
  opacity: number;
}

interface PhysicsConfig {
  force: number;    
  viscosity: number;
  size: number;     
  speed: number;
  color?: string; // NEW: The Spectral Wavelength
}

interface FluidBackgroundProps {
  isForging?: boolean;
  config?: PhysicsConfig; 
}

export default function FluidBackground({ isForging = false, config }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const FORCE = config?.force ?? 80;
  const DRAG = config?.viscosity ?? 0.92;
  const BASE_SIZE = config?.size ?? 1.2;
  const SPEED_MOD = config?.speed ?? 1.0;
  const COLOR = config?.color ?? '#FFFFFF'; // Default to Photon White
  
  const SPACING = 28;
  const EASE = 0.08;

  // Helper to convert Hex to RGB for opacity handling
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
  };
  
  const RGB_COLOR = hexToRgb(COLOR);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationId: number;
    let mouse = { x: -1000, y: -1000 };
    let parentWidth = 0;
    let parentHeight = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        parentWidth = rect.width;
        parentHeight = rect.height;
        
        const dpr = window.devicePixelRatio || 2;
        canvas.width = parentWidth * dpr;
        canvas.height = parentHeight * dpr;
        canvas.style.width = `${parentWidth}px`;
        canvas.style.height = `${parentHeight}px`;
        
        ctx.scale(dpr, dpr);
        initParticles(parentWidth, parentHeight);
      }
    };

    const initParticles = (width: number, height: number) => {
      particles = [];
      const cols = Math.floor(width / SPACING);
      const rows = Math.floor(height / SPACING);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const tx = i * SPACING + (width - cols * SPACING) / 2;
          const ty = j * SPACING + (height - rows * SPACING) / 2;
          
          particles.push({
            x: tx, y: ty, originX: tx, originY: ty,
            vx: 0, vy: 0,
            size: Math.random() > 0.92 ? BASE_SIZE * 2.5 : BASE_SIZE, 
            targetSize: Math.random() > 0.92 ? BASE_SIZE * 2 : BASE_SIZE,
            opacity: 0.5 + Math.random() * 0.5 
          });
        }
      }
    };

    const render = () => {
      // CLEAR
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, parentWidth, parentHeight);
      
      const RADIUS = Math.min(parentWidth, parentHeight) * 0.4;

      particles.forEach((p) => {
        if (isForging) {
          const centerX = parentWidth / 2;
          const centerY = parentHeight / 2;
          p.vx += (centerX - p.x) * 0.06;
          p.vy += (centerY - p.y) * 0.06;
        } else {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < RADIUS) {
            const force = (RADIUS - dist) / RADIUS;
            const angle = Math.atan2(dy, dx);
            p.vx -= Math.cos(angle) * force * FORCE * 0.15;
            p.vy -= Math.sin(angle) * force * FORCE * 0.15;
          }

          p.vx += (p.originX - p.x) * EASE;
          p.vy += (p.originY - p.y) * EASE;
        }

        p.vx *= DRAG;
        p.vy *= DRAG;
        p.x += p.vx * SPEED_MOD;
        p.y += p.vy * SPEED_MOD;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const alpha = isForging ? 1 : Math.min(1, p.opacity + (speed * 0.05));
        
        ctx.fillStyle = `rgba(${RGB_COLOR}, ${alpha})`;
        ctx.fill();

        // CHROMATIC GLOW: Add bloom to larger particles if color is not white
        if (COLOR !== '#FFFFFF' && p.size > 2) {
           ctx.shadowColor = COLOR;
           ctx.shadowBlur = 15;
        } else {
           ctx.shadowBlur = 0;
        }
      });

      animationId = requestAnimationFrame(render);
    };

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener('mousemove', handleMove);
    resize(); 
    render();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(animationId);
    };
  }, [isForging, config]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-black z-0 block" />;
}