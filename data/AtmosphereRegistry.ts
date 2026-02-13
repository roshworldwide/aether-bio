// data/AtmosphereRegistry.ts

// The "Titan" Engine supports all these, but we are only exposing 6 for the MVP.
export type EngineType = 
  | 'GRAVITY' | 'VELOCITY' | 'LATTICE' | 'TEXT_FALL' | 'FLOW' 
  | 'ORBIT' | 'NOISE' | 'BOIDS' | 'CYBER_GRID' | 'WAVEFORM' 
  | 'VORONOI' | 'QUANTUM_FLUX' | 'LIQUID' | 'FIRE' | 'FABRIC' | 'GLITCH' | 'DNA';

export interface ThemePreset {
  id: string;
  name: string;
  engine: EngineType;
  color: string;
  config: { 
    force: number;   // Interaction Strength
    speed: number;   // Motion Speed
    density: number; // Particle Count
    glow: number;    // Bloom Intensity
    radius: number;  // UI Corner Radius
  };
  premium: boolean;
}

// --- THE ALPHA 6 (LAUNCH COLLECTION) ---
export const CENTURY_ARCHIVE: ThemePreset[] = [
  
  // 1. THE CLASSIC (Clean, Minimal Apple Look)
  { 
    id: '001', 
    name: 'Singularity Prime', 
    engine: 'GRAVITY', 
    color: '#FFFFFF', 
    config: { force: 80, speed: 20, density: 60, glow: 1.5, radius: 24 }, 
    premium: false 
  },

  // 2. THE SPEED (High Energy)
  { 
    id: '002', 
    name: 'Hyperdrive', 
    engine: 'VELOCITY', 
    color: '#2E93FF', 
    config: { force: 50, speed: 80, density: 40, glow: 2.0, radius: 24 }, 
    premium: false 
  },

  // 3. THE HACKER (Developer Favorite)
  { 
    id: '003', 
    name: 'Matrix Rain', 
    engine: 'TEXT_FALL', 
    color: '#39FF14', 
    config: { force: 0, speed: 30, density: 50, glow: 1.2, radius: 0 }, 
    premium: false 
  },

  // 4. THE NETWORK (Biology/Tech Hybrid)
  { 
    id: '004', 
    name: 'Neural Lattice', 
    engine: 'LATTICE', 
    color: '#A855F7', 
    config: { force: 20, speed: 10, density: 60, glow: 1.8, radius: 12 }, 
    premium: false 
  },

  // 5. THE DARK MODE (Subtle Background)
  { 
    id: '005', 
    name: 'Deep Void', 
    engine: 'GRAVITY', // Using GRAVITY with low speed behaves like NOISE
    color: '#111111', 
    config: { force: 10, speed: 5, density: 90, glow: 0.5, radius: 0 }, 
    premium: false 
  },

  // 6. THE FLOW (Liquid/Wind)
  { 
    id: '006', 
    name: 'Solar Wind', 
    engine: 'QUANTUM_FLUX', // Upgraded from 'FLOW' to 'FLUX' for better physics
    color: '#FF9F0A', 
    config: { force: 60, speed: 40, density: 50, glow: 2.5, radius: 30 }, 
    premium: false 
  },
];