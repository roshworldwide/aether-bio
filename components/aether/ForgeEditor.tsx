'use client';

import { useState, useEffect, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Search, Lock, Zap, Sliders, Type, Database } from 'lucide-react'; 
import { ProjectDNA } from '../../data/projects';

// --- IMPORTS ---
import { CENTURY_ARCHIVE, ThemePreset } from '../../data/AtmosphereRegistry';
import AtmosphereEngine from './AtmosphereEngine';

const glassPanel = "bg-[#050505]/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]";

interface ForgeEditorProps { project: ProjectDNA; onClose: () => void; }

export default function ForgeEditor({ project, onClose }: ForgeEditorProps) {
  // --- STATE ---
  const [activePreset, setActivePreset] = useState<ThemePreset>(CENTURY_ARCHIVE[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'CONTROLS' | 'REGISTRY'>('REGISTRY');
  
  // --- MANUAL OVERRIDES (THE FLIGHT DECK) ---
  const [customColor, setCustomColor] = useState(activePreset.color);
  const [customForce, setCustomForce] = useState(activePreset.config.force);
  const [customSpeed, setCustomSpeed] = useState(activePreset.config.speed);
  const [customDensity, setCustomDensity] = useState(activePreset.config.density);
  const [customGlow, setCustomGlow] = useState(activePreset.config.glow);
  const [customRadius, setCustomRadius] = useState(activePreset.config.radius);

  // --- CONTENT INJECTION ---
  const [customTitle, setCustomTitle] = useState(project.title);
  const [tagline, setTagline] = useState("AUTONOMOUS GENERATIVE ENTITY");
  const [btnText, setBtnText] = useState("BEGIN SESSION");

  // Sync sliders when preset changes (but allow override)
  useEffect(() => {
    setCustomColor(activePreset.color);
    setCustomForce(activePreset.config.force);
    setCustomSpeed(activePreset.config.speed);
    setCustomDensity(activePreset.config.density);
    setCustomGlow(activePreset.config.glow);
    setCustomRadius(activePreset.config.radius);
  }, [activePreset]);

  const filteredPresets = useMemo(() => {
    return CENTURY_ARCHIVE.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  // --- EXPORT LOGIC ---
  const handleExport = async () => {
    try {
        const btn = document.getElementById('export-btn');
        if(btn) btn.innerText = "COMPRESSING SYSTEM...";
        
        const zip = new JSZip();
        const folderName = project.title.replace(/\s+/g, '-').toLowerCase();
        const folder = zip.folder(folderName);
        
        const finalConfig = {
            title: customTitle, tagline, buttonText: btnText,
            theme: { 
                ...activePreset, 
                color: customColor, 
                config: { force: customForce, speed: customSpeed, density: customDensity, glow: customGlow, radius: customRadius }
            }
        };
        
        folder?.file("neural.config.json", JSON.stringify(finalConfig, null, 2));
        
        const pageCode = `
'use client';
import React from 'react';
const CONFIG = ${JSON.stringify(finalConfig, null, 2)};
export default function NeuralGateway() {
  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-hidden relative selection:bg-white/20">
       <div className="absolute inset-0 z-0" style={{background: \`radial-gradient(circle at center, \${CONFIG.theme.color}20 0%, transparent 60%)\`}} />
       <div className="relative z-10 h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-9xl font-black italic tracking-tighter mb-8" style={{ color: CONFIG.theme.color, textShadow: \`0 0 40px \${CONFIG.theme.color}50\` }}>
             {CONFIG.title.toUpperCase()}
          </h1>
          <button className="px-12 py-5 border border-white/20 hover:bg-white hover:text-black transition-all tracking-[0.3em] text-xs font-bold"
                  style={{ borderRadius: CONFIG.theme.config.radius }}>
             {CONFIG.buttonText}
          </button>
          <div className="absolute bottom-12 text-[10px] opacity-40 tracking-[0.3em] font-mono">ENGINEERED BY ROSH</div>
       </div>
    </main>
  );
}`;
        folder?.file("page.tsx", pageCode);
        
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${folderName}-NEURAL-PACK.zip`);
        
        if(btn) btn.innerText = "DOWNLOAD COMPLETE";
        setTimeout(() => { if(btn) btn.innerText = "INITIALIZE & EXPORT"; }, 2000);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050505] text-white overflow-hidden font-sans selection:bg-white/20">
        
        <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

        {/* HEADER */}
        <div className={`h-16 ${glassPanel} flex items-center justify-between px-6 z-40 relative mt-4 mx-4 rounded-xl`}>
            <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: customColor, boxShadow: `0 0 15px ${customColor}` }} />
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Apple 2126 <span className="mx-2 text-white/10">|</span> Omni-Editor V2</span>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-all text-xs">CLOSE UPLINK</button>
        </div>

        <div className="flex-1 flex relative z-10 gap-4 p-4 overflow-hidden">
            
            {/* --- LEFT: THE FLIGHT CONTROL DECK --- */}
            <div className={`w-[450px] ${glassPanel} rounded-3xl flex flex-col overflow-hidden`}>
                
                {/* TABS */}
                <div className="flex border-b border-white/5">
                    <button 
                        onClick={() => setActiveTab('REGISTRY')}
                        className={`flex-1 py-4 text-[10px] font-bold tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${activeTab === 'REGISTRY' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <Database className="w-3 h-3" /> ARCHIVE
                    </button>
                    <button 
                        onClick={() => setActiveTab('CONTROLS')}
                        className={`flex-1 py-4 text-[10px] font-bold tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${activeTab === 'CONTROLS' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <Sliders className="w-3 h-3" /> CONTROLS
                    </button>
                </div>

                {/* --- TAB 1: REGISTRY (THE LIST) --- */}
                {activeTab === 'REGISTRY' && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/5">
                            <div className="relative group">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-white/30 group-focus-within:text-white/80 transition-colors" />
                                <input 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search 100 Themes..." 
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-white focus:border-white/30 outline-none transition-all placeholder:text-white/20"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
                            {filteredPresets.map(preset => (
                                <button 
                                    key={preset.id} 
                                    onClick={() => !preset.premium && setActivePreset(preset)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all group ${
                                        activePreset.id === preset.id 
                                        ? 'bg-white text-black border-white' 
                                        : 'bg-black/20 border-white/5 text-white/50 hover:border-white/20 hover:text-white'
                                    } ${preset.premium ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${activePreset.id === preset.id ? 'bg-black' : 'bg-white/20'}`} />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[10px] font-bold tracking-widest">{preset.name.toUpperCase()}</span>
                                            <span className="text-[8px] opacity-50 tracking-wider">{preset.engine} ENGINE</span>
                                        </div>
                                    </div>
                                    {preset.premium && <Lock className="w-3 h-3 text-white/20" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB 2: CONTROLS (THE TOOLS) --- */}
                {activeTab === 'CONTROLS' && (
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
                        
                        {/* 1. TEXT INJECTION */}
                        <div className="space-y-4">
                            <label className="text-[9px] text-white/30 font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                                <Type className="w-3 h-3" /> Semantic Injection
                            </label>
                            <div className="space-y-2">
                                <input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-bold text-white focus:border-white/40 focus:bg-white/10 transition-all outline-none" placeholder="PROJECT TITLE" />
                                <div className="grid grid-cols-2 gap-2">
                                    <input value={tagline} onChange={(e) => setTagline(e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono tracking-widest text-white/60 focus:border-white/40 outline-none" placeholder="TAGLINE" />
                                    <input value={btnText} onChange={(e) => setBtnText(e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold tracking-widest text-primary focus:border-white/40 outline-none" 
                                    style={{ color: customColor }} placeholder="BUTTON TEXT" />
                                </div>
                            </div>
                        </div>

                        <div className="h-[1px] w-full bg-white/5" />

                        {/* 2. PHYSICS ENGINE */}
                        <div className="space-y-6">
                            <label className="text-[9px] text-white/30 font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                                <Zap className="w-3 h-3" /> Physics Parameters
                            </label>
                            {[
                                { label: 'FIELD FORCE', val: customForce, set: setCustomForce, max: 100 },
                                { label: 'VELOCITY', val: customSpeed, set: setCustomSpeed, max: 100 },
                                { label: 'DENSITY', val: customDensity, set: setCustomDensity, max: 100 },
                                { label: 'NEON FLUX', val: customGlow, set: setCustomGlow, max: 3, step: 0.1 },
                                { label: 'CORNER RADIUS', val: customRadius, set: setCustomRadius, max: 50 }
                            ].map((s, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between text-[9px] font-mono mb-2 text-white/40 group-hover:text-white transition-colors">
                                        <span>{s.label}</span>
                                        <span style={{ color: customColor }}>{s.val}</span>
                                    </div>
                                    <input type="range" min="0" max={s.max} step={s.step || 1} value={s.val} onChange={(e) => s.set(Number(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:bg-white/20 transition-all" />
                                </div>
                            ))}
                        </div>

                        <div className="h-[1px] w-full bg-white/5" />

                        {/* 3. SPECTRAL KERNEL */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-[9px] text-white/30 font-bold tracking-[0.3em] uppercase">Spectral Kernel</label>
                                <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="w-4 h-4 rounded-full border-0 p-0 bg-transparent cursor-pointer" />
                            </div>
                            <div className="flex gap-2">
                                {['#FFFFFF', '#2E93FF', '#39FF14', '#FF3B30', '#A855F7', '#FF9F0A'].map(c => (
                                    <button key={c} onClick={() => setCustomColor(c)} 
                                        className="w-8 h-8 rounded-lg border border-white/10 hover:scale-110 transition-transform" 
                                        style={{ backgroundColor: c, boxShadow: customColor === c ? `0 0 10px ${c}` : 'none' }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* EXPORT ACTION */}
                <div className="p-6 border-t border-white/5 bg-black/40 mt-auto">
                    <button id="export-btn" onClick={handleExport} 
                            className="w-full py-4 bg-white text-black font-black text-[10px] tracking-[0.3em] rounded-xl hover:scale-[1.01] transition-all relative overflow-hidden group shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <span className="relative z-10">INITIALIZE & EXPORT</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>
                </div>
            </div>

            {/* --- RIGHT: LIVE SIMULATION --- */}
            <div className={`flex-1 ${glassPanel} rounded-3xl relative overflow-hidden flex items-center justify-center`}>
                <AtmosphereEngine 
                    preset={activePreset} 
                    customConfig={{
                        color: customColor,
                        force: customForce,
                        speed: customSpeed,
                        density: customDensity
                    }}
                />
                
                <div className="relative z-10 text-center p-16 mix-blend-screen transition-all duration-500" style={{ transform: `scale(${1 + customForce * 0.0005})` }}>
                    <h1 className="text-9xl font-black italic tracking-tighter mb-6 transition-colors duration-300 select-none"
                        style={{ color: customColor, textShadow: `0 0 ${20 * customGlow}px ${customColor}` }}>
                        {customTitle}
                    </h1>
                    <p className="text-[10px] font-mono text-white/50 tracking-[0.8em] uppercase mb-12 select-none">{tagline}</p>
                    <button className="px-10 py-4 border border-white/30 text-[10px] font-bold tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all select-none backdrop-blur-md"
                            style={{ borderRadius: customRadius, boxShadow: `0 0 ${10 * customGlow}px ${customColor}40` }}>
                        {btnText}
                    </button>
                </div>

                <div className="absolute bottom-10 flex flex-col items-center gap-2 pointer-events-none z-20 opacity-60">
                     <div className="h-[1px] w-12 bg-white/40" />
                     <div className="text-[8px] font-bold tracking-[0.3em] text-white/80 font-mono uppercase">Apple 2126</div>
                     <div className="text-[6px] tracking-[0.2em] text-white/30">ENGINEERED BY ROSH</div>
                </div>
            </div>

        </div>
    </div>
  );
}