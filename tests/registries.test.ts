import { describe, it, expect } from 'vitest';
import { getThemeById, listThemes, registerTheme, validateTheme } from '../src/registries/themes';
import { getFontById, listFonts, registerFont, validateFont } from '../src/registries/fonts';
import { getFrameById, listFrames, registerFrame, validateFrame } from '../src/registries/frames';
import { getPaperSizeById, listPaperSizes, registerPaperSize, validatePaperPreset } from '../src/registries/paperSizes';

describe('Declarative Registries & Contributor Schemas', () => {
  describe('Themes Registry', () => {
    it('contains standard developer themes', () => {
      const themes = listThemes();
      expect(themes.length).toBeGreaterThanOrEqual(10);
      expect(getThemeById('tokyo-night').id).toBe('tokyo-night');
      expect(getThemeById('dracula').id).toBe('dracula');
      expect(getThemeById('one-dark-pro').id).toBe('one-dark-pro');
      expect(getThemeById('catppuccin-mocha').id).toBe('catppuccin-mocha');
    });

    it('falls back to tokyo-night for unknown theme id', () => {
      expect(getThemeById('unknown-theme').id).toBe('tokyo-night');
    });

    it('validates theme definitions', () => {
      expect(validateTheme(getThemeById('tokyo-night'))).toBe(true);
      expect(validateTheme({ id: 'bad' })).toBe(false);
      expect(validateTheme(null)).toBe(false);
    });

    it('registers a custom theme', () => {
      const customTheme = {
        id: 'matrix-green',
        name: 'Matrix Green',
        type: 'dark' as const,
        background: '#001100',
        foreground: '#00ff66',
        selection: '#003300',
        cursor: '#00ff66',
        lineHighlight: '#002200',
        diffAdd: 'rgba(0, 255, 100, 0.2)',
        diffRemove: 'rgba(255, 0, 0, 0.2)',
        syntax: {
          keywords: '#00ff66',
          strings: '#33ff99',
          functions: '#00ee55',
          variables: '#00cc44',
          comments: '#005511',
          numbers: '#66ffaa',
          operators: '#00ff66',
          types: '#99ffcc',
          punctuation: '#00aa33',
        },
        shikiTheme: 'vitesse-dark',
      };

      registerTheme(customTheme);
      expect(getThemeById('matrix-green').name).toBe('Matrix Green');
    });
  });

  describe('Fonts Registry', () => {
    it('contains curated programming fonts with ligature configurations', () => {
      const fonts = listFonts();
      expect(fonts.length).toBeGreaterThanOrEqual(6);
      expect(getFontById('jetbrains-mono').ligatures).toBe(true);
      expect(getFontById('fira-code').ligatures).toBe(true);
      expect(getFontById('ibm-plex-mono').ligatures).toBe(false);
    });

    it('validates fonts schema', () => {
      expect(validateFont(getFontById('jetbrains-mono'))).toBe(true);
      expect(validateFont({ id: 'invalid' })).toBe(false);
    });
  });

  describe('Frames Registry', () => {
    it('contains macOS, Windows, Terminal, Browser, and Minimal frames', () => {
      const frames = listFrames();
      expect(frames.length).toBeGreaterThanOrEqual(6);
      expect(getFrameById('macos-filled').style).toBe('macos-filled');
      expect(getFrameById('windows').style).toBe('windows');
      expect(getFrameById('terminal').style).toBe('terminal');
      expect(getFrameById('browser').style).toBe('browser');
    });

    it('validates frames schema', () => {
      expect(validateFrame(getFrameById('macos-filled'))).toBe(true);
      expect(validateFrame({})).toBe(false);
    });
  });

  describe('Paper Sizes Registry', () => {
    it('lists print, presentation, and social media presets', () => {
      const printSizes = listPaperSizes('print');
      expect(printSizes.some((p) => p.id === 'a4-portrait')).toBe(true);
      expect(printSizes.some((p) => p.id === 'letter-portrait')).toBe(true);

      const presentationSizes = listPaperSizes('presentation');
      expect(presentationSizes.some((p) => p.id === 'slide-16-9')).toBe(true);

      const socialSizes = listPaperSizes('social');
      expect(socialSizes.some((p) => p.id === 'opengraph')).toBe(true);
    });

    it('validates paper presets schema', () => {
      expect(validatePaperPreset(getPaperSizeById('a4-portrait'))).toBe(true);
      expect(validatePaperPreset({ id: 'broken' })).toBe(false);
    });
  });
});
