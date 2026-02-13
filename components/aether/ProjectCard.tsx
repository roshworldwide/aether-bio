'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectDNA } from '../../data/projects';
import FluidBackground from './FluidBackground';

interface ProjectCardProps {
  project: ProjectDNA;
  index: number;
  onClick: (project: ProjectDNA) => void;
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // ASSIGNING UNIQUE "BRAND DNA" COLORS
  const getProjectColor = (i: number) => {
    const colors = [
      '#FFFFFF', // 0: Photon White
      '#FF9500', // 1: Hazard Orange
      '#32D74B', // 2: Bio Green
      '#007AFF', // 3: Neural Blue
      '#FF2D55', // 4: Plasma Pink
      '#AF52DE', // 5: Deep Purple
    ];
    return colors[i % colors.length];
  };

  const brandColor = getProjectColor(index);

  return (
    <motion.div
      onClick={() => onClick(project)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      // --- UPDATED STYLING FOR BETTER VISIBILITY ---
      // 1. bg-[#0a0a0a]: Lighter black for better contrast
      // 2. border-white/20: Stronger edge definition
      // 3. shadow-[0_0_30px_rgba(0,0,0,0.8)]: Adds depth, separating card from background
      className="group relative h-[320px] rounded-[40px] bg-[#0a0a0a] border border-white/20 overflow-hidden cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-500"
    >
      {/* 1. DORMANT STATE: NOISE & STRONGER REFLECTION GRADIENT */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
      {/* Increased opacity of the top-left reflection for a "glass" look */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-500" />

      {/* 2. ACTIVE STATE: LIVE PHYSICS PORTAL */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-0 bg-black"
          >
            <FluidBackground
              config={{
                force: 40,        
                viscosity: 0.90,  
                size: 1.0,        
                speed: 0.8,
                color: brandColor 
              }}
            />
            {/* VIGNETTE */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,black_100%)] pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CONTENT LAYER */}
      <div className="relative z-10 p-10 h-full flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="px-3 py-1 rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
             <span className="text-[9px] tracking-[0.3em] text-white/40 font-bold uppercase group-hover:text-white transition-colors">
               {project.category}
             </span>
          </div>
          {/* Status Light */}
          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isHovered ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/10'}`} 
               style={{ backgroundColor: isHovered ? brandColor : undefined, boxShadow: isHovered ? `0 0 15px ${brandColor}` : undefined }}
          />
        </div>

        {/* Body */}
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter mix-blend-difference group-hover:scale-105 transition-transform duration-500 origin-left">
            {project.title}
          </h3>
          {/* Separator Line */}
          <div className="h-[1px] w-12 bg-white/20 mt-6 group-hover:w-full transition-all duration-700 ease-out" 
               style={{ backgroundColor: isHovered ? brandColor : 'rgba(255,255,255,0.2)' }} 
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity duration-500">
           <p className="text-[9px] text-white tracking-[0.3em] uppercase font-bold">
             Inspect Node
           </p>
           <span className="text-xl text-white">→</span>
        </div>

      </div>
    </motion.div>
  );
}