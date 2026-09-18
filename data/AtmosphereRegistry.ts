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
    force: number;
    speed: number;
    density: number;
    glow: number;
    radius: number;
  };
  premium: boolean;
}

export const CENTURY_ARCHIVE: ThemePreset[] = [
  
  { 
    id: '001', 
    name: 'Singularity Prime', 
    engine: 'GRAVITY', 
    color: '#FFFFFF', 
    config: { force: 80, speed: 20, density: 60, glow: 1.5, radius: 24 }, 
    premium: false 
  },

  { 
    id: '002', 
    name: 'Hyperdrive', 
    engine: 'VELOCITY', 
    color: '#2E93FF', 
    config: { force: 50, speed: 80, density: 40, glow: 2.0, radius: 24 }, 
    premium: false 
  },

  { 
    id: '003', 
    name: 'Matrix Rain', 
    engine: 'TEXT_FALL', 
    color: '#39FF14', 
    config: { force: 0, speed: 30, density: 50, glow: 1.2, radius: 0 }, 
    premium: false 
  },

  { 
    id: '004', 
    name: 'Neural Lattice', 
    engine: 'LATTICE', 
    color: '#A855F7', 
    config: { force: 20, speed: 10, density: 60, glow: 1.8, radius: 12 }, 
    premium: false 
  },

  { 
    id: '005', 
    name: 'Deep Void', 
    engine: 'GRAVITY',
    color: '#111111', 
    config: { force: 10, speed: 5, density: 90, glow: 0.5, radius: 0 }, 
    premium: false 
  },

  { 
    id: '006', 
    name: 'Solar Wind', 
    engine: 'QUANTUM_FLUX',
    color: '#FF9F0A', 
    config: { force: 60, speed: 40, density: 50, glow: 2.5, radius: 30 }, 
    premium: false 
  },
];