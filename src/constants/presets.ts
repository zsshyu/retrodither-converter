import type { Preset } from '../types';

export const PRESETS: Preset[] = [
  { name: 'Classic B&W', darkColor: '#000000', lightColor: '#ffffff' },
  { name: 'Macintosh', darkColor: '#000000', lightColor: '#f5f5dc' },
  { name: 'Amber Terminal', darkColor: '#000000', lightColor: '#ffb000' },
  { name: 'Green Phosphor', darkColor: '#000000', lightColor: '#33ff33' },
  { name: 'Blueprint', darkColor: '#1a237e', lightColor: '#ffffff' },
  { name: 'Neon Cyan', darkColor: '#000000', lightColor: '#00ffff' },
  { name: 'Sepia', darkColor: '#3d2914', lightColor: '#f4e4bc' },
  { name: 'Sunset', darkColor: '#1a0a2e', lightColor: '#ff6b35' },
  // New presets with Tint mode and RGB noise
  {
    name: 'CRT Blue',
    darkColor: '#0a1628',
    lightColor: '#a8d4ff',
    colorMode: 'tint',
    noiseType: 'rgb',
    noiseAmount: 25
  },
  {
    name: 'CRT Green',
    darkColor: '#0a1a0a',
    lightColor: '#90ee90',
    colorMode: 'tint',
    noiseType: 'rgb',
    noiseAmount: 20
  },
  {
    name: 'VHS Purple',
    darkColor: '#1a0a2e',
    lightColor: '#e0b0ff',
    colorMode: 'tint',
    noiseType: 'rgb',
    noiseAmount: 30
  },
  {
    name: 'Film Grain',
    darkColor: '#1a1a1a',
    lightColor: '#f0f0f0',
    colorMode: 'tint',
    noiseType: 'grayscale',
    noiseAmount: 15
  },
];
