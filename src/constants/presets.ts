import type { Preset } from '../types';

export const PRESETS: Preset[] = [
  {
    name: 'Retro Blue',
    palette: ['#051b2c', '#203a55', '#577590', '#b9d6ef'],
    bloomThreshold: 180,
    bloomIntensity: 50,
    noiseType: 'grayscale',
    noiseAmount: 15
  },
  {
    name: 'Classic B&W',
    palette: ['#000000', '#ffffff']
  },
  {
    name: 'GameBoy Green',
    palette: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f']
  },
  {
    name: 'Amber Terminal',
    palette: ['#000000', '#332200', '#cc8800', '#ffb000']
  },
  {
    name: 'Sunset',
    palette: ['#1a0000', '#661a00', '#cc3300', '#ff6633']
  },
  {
    name: 'Neon Cyan',
    palette: ['#000000', '#004444', '#00aaaa', '#00ffff']
  },
];
