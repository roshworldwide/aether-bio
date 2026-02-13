'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GenesisModalProps {
  onClose: () => void;
  // UPDATE: Change from "() => void" to "(title: string) => void"
  onSuccess: (title: string) => void; 
}

export default function GenesisModal({ onClose, onSuccess }: GenesisModalProps) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<string[]>([]); // Conversation history
  
  // THE AI PERSONA
  const prompts = [
    "NEURAL LINK ESTABLISHED.",
    "IDENTIFY PROJECT VECTOR...",
    "DEFINING PARAMETERS: VISCOSITY, MASS, INTENT.",
    "COMPILING DNA SEQUENCE..."
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (step < prompts.length - 1 && step !== 1) {
      setIsTyping(true);
      timeout = setTimeout(() => {
        setIsTyping(false);
        setHistory(prev => [...prev, prompts[step]]);
        setStep(prev => prev + 1);
      }, 1500);
    } else if (step === prompts.length - 1) {
       timeout = setTimeout(() => {
         // EXTRACT USER INPUT: Find the line starting with ">"
         const userTitle = history.find(line => line.startsWith('> '))?.replace('> ', '') || "UNKNOWN PROJECT";
         onSuccess(userTitle.toUpperCase()); // Send data to parent
         onClose();
       }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [step, history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      setHistory(prev => [...prev, `> ${input}`]); // Add user input to history
      setInput('');
      setStep(prev => prev + 1); // Move to next AI prompt
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      <motion.div 
         initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
         className="w-full max-w-3xl min-h-[400px] bg-[#050505] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative"
      >
         {/* HEADER */}
         <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-white/[0.02]">
            <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
               <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="text-[9px] tracking-[0.4em] text-white/30 uppercase font-bold">Terminal_01</div>
            <button onClick={onClose} className="text-[10px] text-white/20 hover:text-white uppercase tracking-widest transition-colors">Abort</button>
         </div>

         {/* TERMINAL BODY */}
         <div className="flex-1 p-10 font-mono text-sm space-y-4 overflow-y-auto">
            {/* HISTORY LOG */}
            {history.map((line, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                 className={`tracking-widest ${line.startsWith('>') ? 'text-white' : 'text-green-500'}`}
               >
                 {line}
               </motion.div>
            ))}

            {/* CURRENT AI ACTIVITY */}
            {isTyping && (
               <div className="text-green-500 flex items-center gap-2">
                  <span className="w-2 h-4 bg-green-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">Computing...</span>
               </div>
            )}

            {/* USER INPUT FIELD (Only shows at Step 1) */}
            {step === 1 && (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="flex items-center gap-4 text-xl mt-8 border-b border-white/20 pb-4"
               >
                  <span className="text-white/40">INPUT_VECTOR {'>'}</span>
                  <input 
                     autoFocus
                     type="text" 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={handleKeyDown}
                     className="flex-1 bg-transparent text-white focus:outline-none placeholder-white/10 uppercase tracking-widest font-bold"
                     placeholder="E.G. QUANTUM FINANCE APP"
                  />
               </motion.div>
            )}
         </div>

         {/* FOOTER DECORATION */}
         <div className="h-12 border-t border-white/5 bg-black flex items-center justify-between px-8">
             <div className="flex gap-4">
                <span className="text-[9px] text-white/20 uppercase tracking-[0.3em]">CPU: 12%</span>
                <span className="text-[9px] text-white/20 uppercase tracking-[0.3em]">RAM: 4.2GB</span>
             </div>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#00ff00]" />
         </div>
         
         {/* SCANLINE OVERLAY */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" style={{ backgroundSize: "100% 2px, 3px 100%" }} />
      </motion.div>
    </motion.div>
  );
}