'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface RuntimeProps {
  config: {
    color: string;
    title: string;
    tagline: string;
  };
  onExit: () => void;
}

interface Message {
  id: string; // CHANGED: 'number' to 'string' to support better IDs
  type: 'SYSTEM' | 'USER' | 'AI';
  text: string;
}

export default function RuntimeOS({ config, onExit }: RuntimeProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // INITIAL BOOT SEQUENCE
  useEffect(() => {
    const bootSequence = [
      "ESTABLISHING SECURE UPLINK...",
      "SYNCING NEURAL WEIGHTS...",
      "SYSTEM ONLINE. AWAITING INPUT."
    ];
    
    bootSequence.forEach((msg, i) => {
      setTimeout(() => {
        // FIX: Use random string for ID to prevent collision
        const uniqueId = `${Date.now()}-${Math.random()}`; 
        setMessages(prev => [...prev, { id: uniqueId, type: 'SYSTEM', text: msg }]);
      }, i * 800);
    });
  }, []);

  // AUTO-SCROLL TO BOTTOM
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- THE TRANSMISSION PROTOCOL ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput(''); // Clear field
    
    // 1. ADD USER MESSAGE LOCALLY
    // FIX: Unique ID
    const userId = `${Date.now()}-user`;
    setMessages(prev => [...prev, { id: userId, type: 'USER', text: userText }]);
    setIsThinking(true);

    try {
      // 2. SEND TO THE "BRAIN" (API ROUTE)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: userText, 
            projectTitle: config.title 
        }),
      });

      const data = await res.json();

      // 3. ADD AI RESPONSE
      // FIX: Unique ID
      const aiId = `${Date.now()}-ai`;
      setMessages(prev => [...prev, { id: aiId, type: 'AI', text: data.data }]);
    } catch (e) {
      const errorId = `${Date.now()}-error`;
      setMessages(prev => [...prev, { id: errorId, type: 'SYSTEM', text: "CONNECTION SEVERED." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col relative z-50 pointer-events-auto"
    >
      {/* STATUS BAR */}
      <div className="h-14 flex items-center justify-between px-8 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <span className="text-[10px] font-mono text-white/40">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        <div className="flex gap-1.5">
           <div className="w-1 h-3 rounded-full bg-white/20" />
           <div className="w-1 h-3 rounded-full bg-white/40" />
           <div className="w-1 h-3 rounded-full bg-white/80" />
           <div className="w-1 h-3 rounded-full bg-white" />
        </div>
      </div>

      {/* --- CHAT STREAM --- */}
      <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto no-scrollbar" ref={scrollRef}>
        
        {/* HERO HEADER */}
        <div className="p-6 rounded-3xl border border-white/10 relative overflow-hidden shrink-0" style={{ backgroundColor: `${config.color}10` }}>
           <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <h2 className="text-3xl font-black text-white italic tracking-tighter relative z-10">{config.title}</h2>
           <p className="text-[9px] uppercase tracking-widest text-white/60 mt-2 relative z-10">{config.tagline}</p>
        </div>

        {/* MESSAGES */}
        <div className="space-y-3">
           {messages.map((msg) => (
             <motion.div 
               key={msg.id}
               initial={{ opacity: 0, x: msg.type === 'USER' ? 20 : -20 }} 
               animate={{ opacity: 1, x: 0 }}
               className={`p-4 rounded-2xl flex items-start gap-3 text-[10px] font-mono leading-relaxed ${
                   msg.type === 'USER' 
                   ? 'bg-white/10 text-white ml-auto max-w-[80%]' 
                   : msg.type === 'SYSTEM' 
                     ? 'bg-transparent text-white/30 border border-white/5' 
                     : 'bg-black/40 border border-white/10 text-white/80'
               }`}
             >
                {msg.type !== 'USER' && (
                    <div className={`w-1.5 h-1.5 mt-1 rounded-full ${msg.type === 'SYSTEM' ? 'bg-white/20' : 'animate-pulse'}`} 
                         style={{ backgroundColor: msg.type === 'AI' ? config.color : undefined }} 
                    />
                )}
                <span className="whitespace-pre-wrap">{msg.text}</span>
             </motion.div>
           ))}
           
           {/* THINKING INDICATOR */}
           {isThinking && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 pl-4">
                   <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                   <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                   <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
               </motion.div>
           )}
        </div>
      </div>

      {/* --- INPUT DECK --- */}
      <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex gap-4">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`COMMAND ${config.title}...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-xs text-white focus:outline-none focus:border-white/30 transition-all placeholder-white/20 font-mono"
            />
            <button 
               onClick={handleSend}
               disabled={!input || isThinking}
               className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
        </div>
        
        <div className="mt-6 flex justify-center">
            <button onClick={onExit} className="text-[9px] text-red-500/50 hover:text-red-500 uppercase tracking-widest font-bold transition-colors">
                Terminate Session
            </button>
        </div>
      </div>
    </motion.div>
  );
}