import { BackgroundPreset } from '@/types';

export const BACKGROUND_REGISTRY: Record<string, BackgroundPreset> = {
  'aurora': {
    id: 'aurora',
    name: 'Aurora Borealis',
    type: 'gradient',
    value: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    angle: 135,
  },
  'cosmic-sunset': {
    id: 'cosmic-sunset',
    name: 'Cosmic Sunset',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    angle: 135,
  },
  'neon-dusk': {
    id: 'neon-dusk',
    name: 'Neon Dusk',
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    angle: 135,
  },
  'cyber-mesh': {
    id: 'cyber-mesh',
    name: 'Cyber Mesh',
    type: 'mesh',
    value: 'radial-gradient(at 0% 0%, #7928ca 0px, transparent 50%), radial-gradient(at 100% 100%, #ff0080 0px, transparent 50%), #0f0c1b',
  },
  'ember-glow': {
    id: 'ember-glow',
    name: 'Ember Glow',
    type: 'gradient',
    value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    angle: 135,
  },
  'ocean-abyss': {
    id: 'ocean-abyss',
    name: 'Ocean Abyss',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    angle: 135,
  },
  'emerald-haze': {
    id: 'emerald-haze',
    name: 'Emerald Haze',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
    angle: 135,
  },
  'obsidian-slate': {
    id: 'obsidian-slate',
    name: 'Obsidian Slate',
    type: 'solid',
    value: '#18181b',
  },
  'pure-black': {
    id: 'pure-black',
    name: 'Pure Black',
    type: 'solid',
    value: '#000000',
  },
  'paper-cream': {
    id: 'paper-cream',
    name: 'Paper Cream (Light)',
    type: 'solid',
    value: '#f4efe6',
  },
  'studio-gray': {
    id: 'studio-gray',
    name: 'Studio Gray',
    type: 'gradient',
    value: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
    angle: 135,
  },
  'transparent': {
    id: 'transparent',
    name: 'Transparent',
    type: 'transparent',
    value: 'transparent',
  },
};

export function getBackgroundById(id: string): BackgroundPreset {
  return BACKGROUND_REGISTRY[id] || BACKGROUND_REGISTRY['cosmic-sunset'];
}

export function listBackgrounds(): BackgroundPreset[] {
  return Object.values(BACKGROUND_REGISTRY);
}

