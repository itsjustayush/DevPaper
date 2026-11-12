import { describe, it, expect } from 'vitest';
import { detectLanguage, tokenizeCodeLine, SUPPORTED_LANGUAGES } from '../src/core/syntax';
import { getThemeById } from '../src/registries/themes';

describe('Universal Syntax Engine', () => {
  const theme = getThemeById('tokyo-night');

  it('contains over 20 supported programming languages', () => {
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(20);
    expect(SUPPORTED_LANGUAGES.some((l) => l.id === 'typescript')).toBe(true);
    expect(SUPPORTED_LANGUAGES.some((l) => l.id === 'python')).toBe(true);
    expect(SUPPORTED_LANGUAGES.some((l) => l.id === 'rust')).toBe(true);
    expect(SUPPORTED_LANGUAGES.some((l) => l.id === 'go')).toBe(true);
  });

  describe('Language Auto-Detection', () => {
    it('detects from file extension', () => {
      expect(detectLanguage('index.ts')).toBe('typescript');
      expect(detectLanguage('app.py')).toBe('python');
      expect(detectLanguage('main.rs')).toBe('rust');
      expect(detectLanguage('server.go')).toBe('go');
      expect(detectLanguage('schema.sql')).toBe('sql');
      expect(detectLanguage('page.html')).toBe('html');
    });

    it('detects from source code heuristics when filename is absent', () => {
      expect(detectLanguage(undefined, 'def calculate_sum(a, b):\n  return a + b')).toBe('python');
      expect(detectLanguage(undefined, 'pub fn calculate() -> u32 { 42 }')).toBe('rust');
      expect(detectLanguage(undefined, 'package main\nimport "fmt"')).toBe('go');
      expect(detectLanguage(undefined, 'SELECT id, username FROM users;')).toBe('sql');
      expect(detectLanguage(undefined, '<!DOCTYPE html><html><body>Hello</body></html>')).toBe('html');
      expect(detectLanguage(undefined, '{"name": "devpaper", "version": "1.0"}')).toBe('json');
    });
  });

  describe('Tokenization', () => {
    it('tokenizes keywords, strings, and punctuation accurately', () => {
      const line = 'export const greeting = "hello world";';
      const tokens = tokenizeCodeLine(line, 'typescript', theme);

      expect(tokens.length).toBeGreaterThan(1);
      const keywordToken = tokens.find((t) => t.content === 'export');
      expect(keywordToken).toBeDefined();
      expect(keywordToken?.color).toBe(theme.syntax.keywords);

      const stringToken = tokens.find((t) => t.content === '"hello world"');
      expect(stringToken).toBeDefined();
      expect(stringToken?.color).toBe(theme.syntax.strings);
    });

    it('identifies single line comments', () => {
      const line = '// This is a typescript comment';
      const tokens = tokenizeCodeLine(line, 'typescript', theme);

      expect(tokens.length).toBe(1);
      expect(tokens[0].isComment).toBe(true);
      expect(tokens[0].color).toBe(theme.syntax.comments);
    });
  });
});

