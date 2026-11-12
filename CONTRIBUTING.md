# Contributing to DevPaper

We welcome community contributions to **DevPaper**! This guide explains how to extend DevPaper with new syntax themes, developer fonts, window frames, or paper formats without touching the core rendering or pagination engines.

---

## 1. Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/devpaper.git
cd devpaper

# Install dependencies with pnpm
pnpm install

# Start local Next.js development server
pnpm dev

# Run unit tests
pnpm test
```

---

## 2. Declarative Plugin Registries

All visual capabilities in DevPaper are defined in `src/registries/` behind strict TypeScript schemas and runtime validation functions.

### A. Adding a New Syntax Theme
Open `src/registries/themes.ts` and add your theme definition to `THEME_REGISTRY`:

```typescript
export const THEME_REGISTRY: Record<string, ThemeDefinition> = {
  // ...
  'my-custom-theme': {
    id: 'my-custom-theme',
    name: 'My Custom Theme',
    type: 'dark', // 'dark' | 'light'
    background: '#12141c',
    foreground: '#d4d8e8',
    selection: '#242a3e',
    cursor: '#64ffda',
    lineHighlight: '#191d29',
    diffAdd: 'rgba(72, 199, 142, 0.25)',
    diffRemove: 'rgba(241, 70, 104, 0.25)',
    accent: '#64ffda',
    border: '#242a3e',
    syntax: {
      keywords: '#f97583',
      strings: '#9ecbff',
      functions: '#b392f0',
      variables: '#ffab70',
      comments: '#6a737d',
      numbers: '#79b8ff',
      operators: '#f97583',
      types: '#e1e4e8',
      punctuation: '#b392f0',
    },
    shikiTheme: 'nord', // fallback Shiki identifier
  },
};
```

### B. Adding a New Developer Font
Open `src/registries/fonts.ts` and add your font definition:

```typescript
export const FONT_REGISTRY: Record<string, FontDefinition> = {
  // ...
  'custom-mono': {
    id: 'custom-mono',
    name: 'Custom Mono',
    fontFamily: '"Custom Mono", monospace',
    category: 'monospace',
    ligatures: true,
    weights: [400, 600],
    webFontUrl: 'https://fonts.googleapis.com/css2?family=Custom+Mono&display=swap',
    sampleCode: 'const isCool = (x != null) => true;',
  },
};
```

### C. Adding a New Paper Preset
Open `src/registries/paperSizes.ts` and add your paper format:

```typescript
export const PAPER_REGISTRY: Record<string, PaperPreset> = {
  // ...
  'b5-portrait': {
    id: 'b5-portrait',
    name: 'ISO B5 Book',
    category: 'print', // 'auto' | 'print' | 'presentation' | 'social'
    widthMm: 176,
    heightMm: 250,
    widthPx: 665,
    heightPx: 945,
    dpi: 96,
    aspectRatio: '176/250',
    description: 'Standard technical book format (176 × 250 mm).',
  },
};
```

---

## 3. Testing Your Changes

Make sure all tests pass before submitting a Pull Request:

```bash
# Run Vitest test suite
pnpm test
```

Add test cases in `tests/registries.test.ts` or `tests/paginator.test.ts` to verify your new additions.

---

## 4. Code of Conduct & Pull Request Guidelines

1. **Keep Subsystems Decoupled**: Never import UI components inside `src/core/paginator.ts` or `src/core/exporters/`.
2. **Strict Typing**: All exported functions must include complete TypeScript type signatures.
3. **Branch Naming**: Use feature branches like `feat/theme-monokai` or `fix/pagination-boundary`.
