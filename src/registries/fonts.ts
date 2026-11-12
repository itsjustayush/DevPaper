import { FontDefinition } from '@/types';

export const FONT_REGISTRY: Record<string, FontDefinition> = {
  'jetbrains-mono': {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    fontFamily: '"JetBrains Mono", monospace',
    category: 'monospace',
    ligatures: true,
    weights: [400, 500, 600, 700],
    webFontUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
    sampleCode: 'const solve = (n: number) => n <= 1 ? 1 : n * solve(n - 1);',
  },
  'fira-code': {
    id: 'fira-code',
    name: 'Fira Code',
    fontFamily: '"Fira Code", monospace',
    category: 'monospace',
    ligatures: true,
    weights: [400, 500, 600, 700],
    webFontUrl: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap',
    sampleCode: 'const isReady = (x != null) && (x >= 42) => !!x;',
  },
  'geist-mono': {
    id: 'geist-mono',
    name: 'Geist Mono',
    fontFamily: '"Geist Mono", monospace',
    category: 'monospace',
    ligatures: true,
    weights: [400, 500, 600, 700],
    webFontUrl: 'https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-mono/style.css',
    sampleCode: 'export async function generateStaticParams() {}',
  },
  'ibm-plex-mono': {
    id: 'ibm-plex-mono',
    name: 'IBM Plex Mono',
    fontFamily: '"IBM Plex Mono", monospace',
    category: 'monospace',
    ligatures: false,
    weights: [400, 500, 600, 700],
    webFontUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
    sampleCode: 'typedef unsigned long long uint64_t;',
  },
  'cascadia-code': {
    id: 'cascadia-code',
    name: 'Cascadia Code',
    fontFamily: '"Cascadia Code", "Cascadia Mono", monospace',
    category: 'monospace',
    ligatures: true,
    weights: [400, 600, 700],
    webFontUrl: 'https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code@5.0.14/index.min.css',
    sampleCode: 'auto lambda = [](auto&& arg) -> decltype(auto) { return arg; };',
  },
  'source-code-pro': {
    id: 'source-code-pro',
    name: 'Source Code Pro',
    fontFamily: '"Source Code Pro", monospace',
    category: 'monospace',
    ligatures: false,
    weights: [400, 500, 600, 700],
    webFontUrl: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
    sampleCode: 'pub fn calculate_hash<T: Hash>(t: &T) -> u64',
  },
  'space-mono': {
    id: 'space-mono',
    name: 'Space Mono',
    fontFamily: '"Space Mono", monospace',
    category: 'monospace',
    ligatures: false,
    weights: [400, 700],
    webFontUrl: 'https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap',
    sampleCode: 'SELECT * FROM telemetry WHERE timestamp >= NOW() - INTERVAL 1 DAY',
  },
  'victor-mono': {
    id: 'victor-mono',
    name: 'Victor Mono',
    fontFamily: '"Victor Mono", monospace',
    category: 'monospace',
    ligatures: true,
    weights: [400, 500, 600, 700],
    webFontUrl: 'https://fonts.googleapis.com/css2?family=Victor+Mono:ital,wght@0,400;0,600;1,400&display=swap',
    sampleCode: 'fn cursive_annotations() /* cursive comments */',
  },
};

export function validateFont(font: unknown): font is FontDefinition {
  if (!font || typeof font !== 'object') return false;
  const f = font as Partial<FontDefinition>;
  return (
    typeof f.id === 'string' &&
    typeof f.name === 'string' &&
    typeof f.fontFamily === 'string' &&
    typeof f.ligatures === 'boolean' &&
    Array.isArray(f.weights)
  );
}

export function getFontById(id: string): FontDefinition {
  return FONT_REGISTRY[id] || FONT_REGISTRY['jetbrains-mono'];
}

export function listFonts(): FontDefinition[] {
  return Object.values(FONT_REGISTRY);
}

export function registerFont(font: FontDefinition): void {
  if (!validateFont(font)) {
    throw new Error(`Invalid font definition for "${(font as any)?.id || 'unknown'}"`);
  }
  FONT_REGISTRY[font.id] = font;
}
