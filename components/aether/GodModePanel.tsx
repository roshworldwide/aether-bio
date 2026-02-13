'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIXED PATH BELOW (Two dots, not three)
import { THEMES } from '../../aether.config'; 
import { useTheme } from './ThemeContext';

export default function GodModePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { switchTheme } = useTheme();

  return (
    <div className="fixed bottom-8 right-8 z-[9999] font-mono">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 mb-4 flex flex-col gap-2 min-w-[200px]"
          >
            {Object.keys(THEMES).map((key) => (
              <button
                key={key}
                onClick={() => { switchTheme(key as any); setIsOpen(false); }}
                className="px-4 py-3 text-left text-xs uppercase tracking-widest bg-black/90 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-900/20 transition-all duration-200 rounded-lg shadow-2xl"
              >
                DEPLOY: <span className="text-cyan-400">{key}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-cyan-500 hover:text-white hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300"
      >
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>
        </motion.div>
      </button>
    </div>
  );
}