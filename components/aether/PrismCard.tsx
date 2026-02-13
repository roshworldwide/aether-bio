'use client';

import { motion } from 'framer-motion';

export default function PrismCard({ 
  children, 
  title 
}: { 
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="
        relative w-full max-w-md p-8 rounded-3xl
        bg-white/5 backdrop-blur-2xl
        border border-white/10
        shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]
        overflow-hidden
        group
      "
    >
      {/* 1. The Shimmer Layer (Holographic reflection) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* 2. The Border Glow (Subtle gradient on edge) */}
      <div className="absolute inset-0 rounded-3xl border border-white/5 mask-image-gradient-to-b" />

      {/* 3. The Header (Optional) */}
      {title && (
        <div className="mb-6 border-b border-white/10 pb-4">
          <h2 className="text-xl font-light tracking-[0.2em] text-cyan-100/80 uppercase">
            {title}
          </h2>
        </div>
      )}

      {/* 4. The Content Slot */}
      <div className="relative z-10 text-cyan-50/90 font-light leading-relaxed">
        {children}
      </div>

    </motion.div>
  );
}