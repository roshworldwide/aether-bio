export interface ProjectDNA {
  id: string;
  title: string;
  category: 'NEURAL' | 'LEGAL' | 'CREATIVE' | 'SYSTEM';
  tagline: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'ENCRYPTED';
  accentColor: string;
  spec: {
    fontFamily: string;
    particleForce: number;
    blurIntensity: string;
    hapticStrength: number;
  }
}

export const projects: ProjectDNA[] = [
  {
    id: 'orange-slice',
    title: 'ORANGE SLICE',
    category: 'SYSTEM',
    tagline: 'Hyper-Threading Active',
    status: 'ACTIVE',
    accentColor: '255, 255, 255',
    spec: { fontFamily: 'SF Pro Display', particleForce: 95, blurIntensity: '40px', hapticStrength: 15 }
  },
  {
    id: 'neuro-lawyer',
    title: 'NEURO-LAWYER',
    category: 'LEGAL',
    tagline: 'Autonomous Defense Protocol',
    status: 'ACTIVE',
    accentColor: '220, 220, 220',
    spec: { fontFamily: 'SF Mono', particleForce: 80, blurIntensity: '60px', hapticStrength: 25 }
  }
];