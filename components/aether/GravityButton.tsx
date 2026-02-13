'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function GravityButton({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode; 
  onClick?: () => void 
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect()!;
    
    // Calculate center of the button
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // The "Magnetic" Pull (Button moves 20% of the distance to cursor)
    setPosition({ x: distanceX * 0.2, y: distanceY * 0.2 });
  };

  const handleMouseLeave = () => {
    // Snap back to center when mouse leaves
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="
        relative group rounded-full px-8 py-4 
        bg-white/5 backdrop-blur-md 
        border border-white/10
        text-cyan-100 tracking-widest uppercase text-sm font-bold
        overflow-hidden
        transition-colors duration-300
        hover:bg-cyan-500/10 hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(8,145,178,0.4)]
      "
    >
      {/* The Glow Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      
      {/* The Text */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}