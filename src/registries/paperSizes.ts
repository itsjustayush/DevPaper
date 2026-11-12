import { PaperPreset, PaperCategory } from '@/types';

export const PAPER_REGISTRY: Record<string, PaperPreset> = {
  'auto': {
    id: 'auto',
    name: 'Auto (Single Frame)',
    category: 'auto',
    widthPx: 0, // dynamic
    heightPx: 0, // dynamic
    dpi: 96,
    description: 'Dynamic canvas that tightly wraps around the code snippet.',
  },
  'a4-portrait': {
    id: 'a4-portrait',
    name: 'A4 Portrait',
    category: 'print',
    widthMm: 210,
    heightMm: 297,
    widthPx: 794,
    heightPx: 1123,
    dpi: 96,
    aspectRatio: '210/297',
    description: 'ISO standard A4 document (210 × 297 mm, 300 DPI print-ready).',
  },
  'a4-landscape': {
    id: 'a4-landscape',
    name: 'A4 Landscape',
    category: 'print',
    widthMm: 297,
    heightMm: 210,
    widthPx: 1123,
    heightPx: 794,
    dpi: 96,
    aspectRatio: '297/210',
    description: 'ISO standard A4 wide format (297 × 210 mm). Ideal for wide code lines.',
  },
  'a3-portrait': {
    id: 'a3-portrait',
    name: 'A3 Portrait',
    category: 'print',
    widthMm: 297,
    heightMm: 420,
    widthPx: 1123,
    heightPx: 1587,
    dpi: 96,
    aspectRatio: '297/420',
    description: 'Large ISO A3 format (297 × 420 mm) for posters and architecture schematics.',
  },
  'a5-portrait': {
    id: 'a5-portrait',
    name: 'A5 Booklet',
    category: 'print',
    widthMm: 148,
    heightMm: 210,
    widthPx: 559,
    heightPx: 794,
    dpi: 96,
    aspectRatio: '148/210',
    description: 'Compact A5 format (148 × 210 mm) for cheat sheets and pocket guides.',
  },
  'letter-portrait': {
    id: 'letter-portrait',
    name: 'US Letter Portrait',
    category: 'print',
    widthMm: 215.9,
    heightMm: 279.4,
    widthPx: 816,
    heightPx: 1056,
    dpi: 96,
    aspectRatio: '8.5/11',
    description: 'Standard North American Letter (8.5 × 11 in).',
  },
  'letter-landscape': {
    id: 'letter-landscape',
    name: 'US Letter Landscape',
    category: 'print',
    widthMm: 279.4,
    heightMm: 215.9,
    widthPx: 1056,
    heightPx: 816,
    dpi: 96,
    aspectRatio: '11/8.5',
    description: 'Wide North American Letter format (11 × 8.5 in).',
  },
  'legal-portrait': {
    id: 'legal-portrait',
    name: 'US Legal Portrait',
    category: 'print',
    widthMm: 215.9,
    heightMm: 355.6,
    widthPx: 816,
    heightPx: 1344,
    dpi: 96,
    aspectRatio: '8.5/14',
    description: 'Extended US Legal format (8.5 × 14 in).',
  },
  'slide-16-9': {
    id: 'slide-16-9',
    name: '16:9 Keynote / Slide',
    category: 'presentation',
    widthPx: 1920,
    heightPx: 1080,
    dpi: 96,
    aspectRatio: '16/9',
    description: 'Full HD widescreen (1920 × 1080) for Keynote, PowerPoint, and slides.',
  },
  'slide-4-3': {
    id: 'slide-4-3',
    name: '4:3 Slide Classic',
    category: 'presentation',
    widthPx: 1600,
    heightPx: 1200,
    dpi: 96,
    aspectRatio: '4/3',
    description: 'Traditional presentation slide format (1600 × 1200).',
  },
  'opengraph': {
    id: 'opengraph',
    name: 'OpenGraph / Social (1200×630)',
    category: 'social',
    widthPx: 1200,
    heightPx: 630,
    dpi: 96,
    aspectRatio: '1200/630',
    description: 'Standard Twitter, LinkedIn, and social media preview card dimensions.',
  },
  'readme-hero': {
    id: 'readme-hero',
    name: 'GitHub README Hero Banner',
    category: 'social',
    widthPx: 1280,
    heightPx: 480,
    dpi: 96,
    aspectRatio: '1280/480',
    description: 'Widescreen hero banner optimized for GitHub repository README headers.',
  },
  'square-post': {
    id: 'square-post',
    name: 'Square Post (1080×1080)',
    category: 'social',
    widthPx: 1080,
    heightPx: 1080,
    dpi: 96,
    aspectRatio: '1/1',
    description: 'Square aspect ratio for social media posts, avatar cards, or stickers.',
  },
};

export function validatePaperPreset(preset: unknown): preset is PaperPreset {
  if (!preset || typeof preset !== 'object') return false;
  const p = preset as Partial<PaperPreset>;
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.category === 'string' &&
    typeof p.widthPx === 'number' &&
    typeof p.heightPx === 'number' &&
    typeof p.dpi === 'number'
  );
}

export function getPaperSizeById(id: string): PaperPreset {
  return PAPER_REGISTRY[id] || PAPER_REGISTRY['auto'];
}

export function listPaperSizes(category?: PaperCategory): PaperPreset[] {
  const all = Object.values(PAPER_REGISTRY);
  if (!category) return all;
  return all.filter((p) => p.category === category);
}

export function registerPaperSize(preset: PaperPreset): void {
  if (!validatePaperPreset(preset)) {
    throw new Error(`Invalid paper preset definition for "${(preset as any)?.id || 'unknown'}"`);
  }
  PAPER_REGISTRY[preset.id] = preset;
}

