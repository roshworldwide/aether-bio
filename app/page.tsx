'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ThemeProvider, useTheme } from "@/components/aether/ThemeContext";
import CinematicIntro from "@/components/aether/CinematicIntro";
import FluidBackground from "@/components/aether/FluidBackground"; 
import GlassCockpit from "@/components/aether/GlassCockpit";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

function AppContent() {
  const { currentTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isForging, setIsForging] = useState(false);
  
  // Track focus state for the sleek transition
  const [isFieldFocused, setIsFieldFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- PHYSICS ENGINE ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 25 });
  const tiltX = useTransform(springY, [0, 1000], [3, -3]); 
  const tiltY = useTransform(springX, [0, 1800], [-3, 3]);

  const triggerHaptic = useCallback(() => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(15); 
    }
  }, []);

  const handleContainerClick = () => {
    setIsFieldFocused(true);
    inputRef.current?.focus();
    triggerHaptic();
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <CinematicIntro key={currentTheme.app_name}>
      <main className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-white selection:text-black">
        
        <FluidBackground isForging={isForging} />
        
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

        <motion.div 
            style={{ 
              rotateX: tiltX, 
              rotateY: tiltY, 
              perspective: 2000, 
              transformStyle: "preserve-3d" 
            }}
            className="z-10 w-full h-full flex flex-col items-center justify-center px-4 relative"
        >
            {/* --- THE POWER SPINE --- */}
            <motion.div 
               style={{ z: -50 }} 
               className="absolute right-12 top-0 h-full flex flex-col items-center justify-center z-50 select-none mix-blend-screen opacity-80"
            >
                <div className="relative w-[3px] h-[35vh] overflow-hidden bg-white/20 rounded-full">
                    <motion.div 
                        animate={{ top: ["-100%", "100%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-40 bg-gradient-to-b from-transparent via-white to-transparent"
                    />
                </div>
                <div className="flex flex-col items-center gap-8 py-8">
                    <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-white/70 font-bold" style={{ writingMode: 'vertical-rl' }}>Engineered By</span>
                    <span className="text-3xl font-sans tracking-tighter text-white font-black italic" style={{ writingMode: 'vertical-rl', textShadow: '0 0 40px rgba(255,255,255,0.6)' }}>RoSh</span>
                </div>
                <div className="relative w-[3px] h-[35vh] overflow-hidden bg-white/20 rounded-full">
                    <motion.div 
                        animate={{ top: ["100%", "-100%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-40 bg-gradient-to-b from-transparent via-white to-transparent"
                    />
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {!isLoggedIn ? (
                    <motion.div 
                      key="login" 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-16 relative z-20"
                    >
                        <div className="text-center space-y-4 mix-blend-screen">
                            <h1 className="text-7xl md:text-[9rem] font-bold tracking-tighter text-white italic leading-none drop-shadow-2xl">
                              {currentTheme.app_name}
                            </h1>
                            <p className="text-xs md:text-sm tracking-[1.2em] font-medium uppercase text-white/50">
                              {currentTheme.tagline}
                            </p>
                        </div>

                        {/* --- THE SLEEK BIOMETRIC SLOT --- */}
                        <div className="w-[340px] md:w-[420px] space-y-8">
                             <div className="relative">
                                <label className={`block text-center text-[9px] tracking-[0.4em] uppercase mb-4 font-bold transition-colors duration-500 ${isFieldFocused ? 'text-white' : 'text-white/50'}`}>
                                  {isFieldFocused ? "Enter Identity Token" : "Authentication Required"}
                                </label>
                                
                                {/* The Slim Ingot Container (h-14 / 56px) */}
                                <div 
                                    onClick={handleContainerClick}
                                    className={`relative h-14 rounded-[20px] backdrop-blur-2xl border transition-all duration-500 overflow-hidden cursor-text shadow-[0_0_40px_rgba(0,0,0,0.5)] ${
                                    isFieldFocused 
                                    ? 'bg-white/[0.12] border-white/40' // Revealed
                                    : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-white/20' // Sealed
                                }`}>
                                    
                                    {/* 1. THE INPUT FIELD */}
                                    <input 
                                        ref={inputRef}
                                        type="password" 
                                        onFocus={() => setIsFieldFocused(true)}
                                        // FIXED: We don't force blur immediately, keeping the UI stable
                                        onBlur={(e) => {
                                          if (e.target.value === "") setIsFieldFocused(false);
                                        }}
                                        className={`w-full h-full bg-transparent text-center text-xl tracking-[0.4em] text-white placeholder-white/20 focus:outline-none font-mono font-bold absolute inset-0 z-10 transition-opacity duration-300 ${
                                            isFieldFocused ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    />

                                    {/* 2. THE "LOCKED" SHUTTER */}
                                    <div className={`absolute inset-0 flex items-center justify-center z-20 bg-white/[0.02] backdrop-blur-[2px] transition-all duration-300 pointer-events-none ${
                                        isFieldFocused ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                                            <span className="text-[9px] tracking-[0.3em] text-white/40 font-bold">LOCKED</span>
                                        </div>
                                    </div>
                                    
                                    {/* REMOVED: The "Bottom Glow Bar" (The shadow artifact is gone) */}
                                </div>
                             </div>

                             <div className="flex justify-center">
                                {/* FIXED: Button is no longer disabled by focus state logic */}
                                <button 
                                    onClick={() => setIsLoggedIn(true)}
                                    // Use onMouseDown to prevent focus loss before click registers
                                    onMouseDown={(e) => e.preventDefault()} 
                                    className="px-16 py-5 text-[10px] tracking-[0.3em] text-black bg-white hover:scale-[1.02] active:scale-[0.98] rounded-full transition-all duration-500 uppercase font-black shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] opacity-100"
                                >
                                    Initiate Session
                                </button>
                             </div>
                        </div>

                    </motion.div>
                ) : (                   
                    <GlassCockpit onForgeStateChange={setIsForging} />
                )}
            </AnimatePresence>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-40"
             style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
      </main>
    </CinematicIntro>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}