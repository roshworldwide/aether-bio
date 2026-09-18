'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function NebulaInput({ 
  placeholder, 
  type = "text" 
}: { 
  placeholder: string; 
  type?: string; 
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full group">
      
      <motion.div 
        animate={{
            borderColor: isFocused ? "rgba(34, 211, 238, 0.4)" : "rgba(255, 255, 255, 0.1)",
            boxShadow: isFocused ? "0 0 15px rgba(34, 211, 238, 0.1)" : "none"
        }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-xl bg-black/20 border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
      >
        
        {isFocused && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: 1 }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              ease: "linear",
              repeatDelay: 1
            }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -skew-x-12"
          />
        )}

        <input
          type={type}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            w-full px-6 py-4 
            bg-transparent 
            text-cyan-50 font-light tracking-[0.15em]
            placeholder-cyan-200/20
            outline-none
            transition-all duration-300
          "
          style={{
            textShadow: isFocused ? "0 0 10px rgba(34,211,238,0.5)" : "none"
          }}
        />
        
        <motion.div 
            animate={{ 
                width: isFocused ? "100%" : "0%", 
                opacity: isFocused ? 1 : 0 
            }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent right-0 mx-auto"
        />

      </motion.div>

    </div>
  );
}