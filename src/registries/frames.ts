import { FrameDefinition, FrameStyle } from '@/types';

export const FRAME_REGISTRY: Record<string, FrameDefinition> = {
  'macos-filled': {
    id: 'macos-filled',
    name: 'macOS Classic',
    style: 'macos-filled',
    hasHeader: true,
    description: 'Classic Apple macOS colored traffic light buttons with soft specular gloss.',
  },
  'macos-outline': {
    id: 'macos-outline',
    name: 'macOS Outline',
    style: 'macos-outline',
    hasHeader: true,
    description: 'Subtle outline traffic lights with delicate colored borders.',
  },
  'macos-monochrome': {
    id: 'macos-monochrome',
    name: 'macOS Monochrome',
    style: 'macos-monochrome',
    hasHeader: true,
    description: 'Minimal graphite monochrome controls for quiet technical elegance.',
  },
  'windows': {
    id: 'windows',
    name: 'Windows 11 Modern',
    style: 'windows',
    hasHeader: true,
    description: 'Native Windows fluent window controls (minimize, maximize, close).',
  },
  'terminal': {
    id: 'terminal',
    name: 'Terminal Header',
    style: 'terminal',
    hasHeader: true,
    description: 'Developer terminal shell header with host prompt and session status.',
  },
  'browser': {
    id: 'browser',
    name: 'Modern Browser Tab',
    style: 'browser',
    hasHeader: true,
    description: 'Web browser header with tab strip, lock icon, and URL breadcrumb.',
  },
  'minimal': {
    id: 'minimal',
    name: 'Minimalist Pill',
    style: 'minimal',
    hasHeader: true,
    description: 'Clean borderless header with filename, path, and language pill.',
  },
  'none': {
    id: 'none',
    name: 'Borderless / Pure Code',
    style: 'none',
    hasHeader: false,
    description: 'Frameless code block with no window decorations or top bar.',
  },
};

export function validateFrame(frame: unknown): frame is FrameDefinition {
  if (!frame || typeof frame !== 'object') return false;
  const f = frame as Partial<FrameDefinition>;
  return (
    typeof f.id === 'string' &&
    typeof f.name === 'string' &&
    typeof f.style === 'string' &&
    typeof f.hasHeader === 'boolean'
  );
}

export function getFrameById(id: string): FrameDefinition {
  return FRAME_REGISTRY[id] || FRAME_REGISTRY['macos-filled'];
}

export function listFrames(): FrameDefinition[] {
  return Object.values(FRAME_REGISTRY);
}

export function registerFrame(frame: FrameDefinition): void {
  if (!validateFrame(frame)) {
    throw new Error(`Invalid frame definition for "${(frame as any)?.id || 'unknown'}"`);
  }
  FRAME_REGISTRY[frame.id] = frame;
}
