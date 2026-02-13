'use client';

// A procedural sound synthesizer. No external files required.
const createOscillator = (type: OscillatorType, freq: number, duration: number, vol: number = 0.1) => {
  if (typeof window === 'undefined') return;
  
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const playSfx = (type: 'HOVER' | 'CLICK' | 'DEPLOY' | 'WARP') => {
  if (typeof window === 'undefined') return;

  switch (type) {
    case 'HOVER':
      // Low, subtle hum
      createOscillator('sine', 150, 0.1, 0.05);
      break;
    case 'CLICK':
      // Sharp, mechanical blip
      createOscillator('square', 800, 0.05, 0.05);
      break;
    case 'DEPLOY':
      // Success chime (Two tones)
      createOscillator('sine', 440, 0.2, 0.1);
      setTimeout(() => createOscillator('sine', 880, 0.4, 0.1), 100);
      break;
    case 'WARP':
      // Ramping turbine sound
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 1.5); // Ramp up
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
      break;
  }
};