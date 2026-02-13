'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CinematicIntro({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // REDUCED DELAY: From 2200ms to 400ms for "Instant" feel
    const timer = setTimeout(() => setIsReady(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <AnimatePresence>
        {!isReady && (
          <motion.div 
            key="aperture"
            exit={{ opacity: 0, scale: 2, filter: 'blur(50px)' }} // Faster blur exit
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <motion.div 
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: '100vw', height: '100vw', opacity: [0, 0.3, 0] }}
              transition={{ duration: 1, ease: "easeOut" }} // Snappier aperture
              className="rounded-full bg-[radial-gradient(circle,rgba(94,92,230,0.5)_0%,transparent_70%)] blur-[100px]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, z: -100, filter: 'blur(20px) brightness(0)' }}
        animate={isReady ? { 
          opacity: 1, 
          scale: 1, 
          z: 0,
          filter: 'blur(0px) brightness(1)' 
        } : {}}
        transition={{ 
          type: "spring",
          stiffness: 45, // Increased from 25 for faster arrival
          damping: 20,
          mass: 1.5      // Reduced from 3 to make it feel lighter/faster
        }}
        className="w-full h-full relative z-10"
        style={{ perspective: 2000, transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>

      {/* RETAINING APPLE 2126 SIGNATURE OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20vw_rgba(0,0,0,1)] z-50" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-soft-light z-50"
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
    </div>
  );
}