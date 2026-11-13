/**
 * DevPaper Client-side SVG Preview Generator
 * Mirrors the Python FastAPI SVG rendering engine for instantaneous client preview.
 */

export interface SvgPreviewOptions {
  code: string;
  language?: string;
  fileName?: string;
  theme?: string;
  background?: string;
  frame?: string;
  showLineNumbers?: boolean;
}

interface ThemeConfig {
  background: string;
  foreground: string;
  border: string;
  headerBg: string;
  keyword: string;
  string: string;
  number: string;
  comment: string;
  function: string;
  operator: string;
}

const THEMES: Record<string, ThemeConfig> = {
  'tokyo-night': {
    background: '#1a1b26',
    foreground: '#a9b1d6',
    border: '#292e42',
    headerBg: '#16161e',
    keyword: '#bb9af7',
    string: '#9ece6a',
    number: '#ff9e64',
    comment: '#565f89',
    function: '#7aa2f7',
    operator: '#89ddff',
  },
  'one-dark-pro': {
    background: '#282c34',
    foreground: '#abb2bf',
    border: '#3e4451',
    headerBg: '#21252b',
    keyword: '#c678dd',
    string: '#98c379',
    number: '#d19a66',
    comment: '#5c6370',
    function: '#61afef',
    operator: '#56b6c2',
  },
  'dracula': {
    background: '#282a36',
    foreground: '#f8f8f2',
    border: '#44475a',
    headerBg: '#21222c',
    keyword: '#ff79c6',
    string: '#f1fa8c',
    number: '#bd93f9',
    comment: '#6272a4',
    function: '#50fa7b',
    operator: '#ffb86c',
  },
  'catppuccin': {
    background: '#1e1e2e',
    foreground: '#cdd6f4',
    border: '#313244',
    headerBg: '#181825',
    keyword: '#cba6f7',
    string: '#a6e3a1',
    number: '#fab387',
    comment: '#6c7086',
    function: '#89b4fa',
    operator: '#89dceb',
  },
  'nord': {
    background: '#2e3440',
    foreground: '#d8dee9',
    border: '#3b4252',
    headerBg: '#272c36',
    keyword: '#81a1c1',
    string: '#a3be8c',
    number: '#b48ead',
    comment: '#4c566a',
    function: '#88c0d0',
    operator: '#8fbcbb',
  },
  'monokai': {
    background: '#272822',
    foreground: '#f8f8f2',
    border: '#3e3d32',
    headerBg: '#1e1f1c',
    keyword: '#f92672',
    string: '#e6db74',
    number: '#ae81ff',
    comment: '#75715e',
    function: '#a6e22e',
    operator: '#fd971f',
  },
  'github-dark': {
    background: '#0d1117',
    foreground: '#c9d1d9',
    border: '#30363d',
    headerBg: '#010409',
    keyword: '#ff7b72',
    string: '#a5d6ff',
    number: '#79c0ff',
    comment: '#8b949e',
    function: '#d2a8ff',
    operator: '#79c0ff',
  },
};

const BACKGROUNDS: Record<string, [string, string][]> = {
  'cosmic-sunset': [
    ['#2d0b5a', '0%'],
    ['#801336', '45%'],
    ['#ee4540', '78%'],
    ['#f69d3c', '100%'],
  ],
  'aurora': [
    ['#051923', '0%'],
    ['#003554', '35%'],
    ['#0582ca', '70%'],
    ['#00f5d4', '100%'],
  ],
  'neon-dusk': [
    ['#0f051d', '0%'],
    ['#31103f', '50%'],
    ['#c026d3', '85%'],
    ['#3b82f6', '100%'],
  ],
  'ember-glow': [
    ['#180805', '0%'],
    ['#451208', '40%'],
    ['#ea580c', '75%'],
    ['#facc15', '100%'],
  ],
  'ocean-abyss': [
    ['#020b14', '0%'],
    ['#06283d', '45%'],
    ['#1363df', '80%'],
    ['#47b5ff', '100%'],
  ],
  'obsidian': [
    ['#18181b', '0%'],
    ['#09090b', '100%'],
  ],
  'transparent': [],
};

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function simpleTokenize(line: string, theme: ThemeConfig): { text: string; color: string }[] {
  if (!line) return [];

  // Check comments first
  const commentIdx = line.search(/(\/\/|#|--)/);
  if (commentIdx !== -1) {
    const before = line.slice(0, commentIdx);
    const comment = line.slice(commentIdx);
    const tokens = simpleTokenizeCode(before, theme);
    tokens.push({ text: comment, color: theme.comment });
    return tokens;
  }

  return simpleTokenizeCode(line, theme);
}

function simpleTokenizeCode(code: string, theme: ThemeConfig): { text: string; color: string }[] {
  const tokens: { text: string; color: string }[] = [];
  const regex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:def|class|return|import|from|as|if|else|elif|for|while|try|except|finally|with|async|await|const|let|var|function|type|interface|export|default|null|true|false|None|True|False|self|this)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\()|[+\-*/%=!&|<>?:^~]+|[A-Za-z_][A-Za-z0-9_]*|\s+|[^\s\w])/g;

  let match;
  let lastIndex = 0;

  while ((match = regex.exec(code)) !== null) {
    const text = match[0];
    let color = theme.foreground;

    if (text.startsWith('"') || text.startsWith("'") || text.startsWith('`')) {
      color = theme.string;
    } else if (/^(def|class|return|import|from|as|if|else|elif|for|while|try|except|finally|with|async|await|const|let|var|function|type|interface|export|default)$/.test(text)) {
      color = theme.keyword;
    } else if (/^(null|true|false|None|True|False|self|this)$/.test(text)) {
      color = theme.number;
    } else if (/^\d+(\.\d+)?$/.test(text)) {
      color = theme.number;
    } else if (/^[+\-*/%=!&|<>?:^~]+$/.test(text)) {
      color = theme.operator;
    } else if (code[match.index + text.length] === '(') {
      color = theme.function;
    }

    tokens.push({ text, color });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), color: theme.foreground });
  }

  return tokens;
}

export function render_svg_client_preview(options: SvgPreviewOptions): string {
  const {
    code = 'print("Hello from DevPaper API")',
    fileName = 'snippet.py',
    theme: themeId = 'tokyo-night',
    background: backgroundId = 'cosmic-sunset',
    frame: frameStyle = 'macos',
    showLineNumbers = true,
  } = options;

  const theme = THEMES[themeId] || THEMES['tokyo-night'];
  const bgStops = BACKGROUNDS[backgroundId] || BACKGROUNDS['cosmic-sunset'];

  const rawLines = code.split('\n');
  const lineCount = rawLines.length;

  let maxChars = 0;
  for (const l of rawLines) {
    if (l.length > maxChars) maxChars = l.length;
  }

  const charWidth = 8.5;
  const lineHeight = 22;
  const headerHeight = frameStyle !== 'none' ? 42 : 16;
  const footerHeight = 24;
  const padding = 36;
  const gutterWidth = showLineNumbers ? 44 : 16;

  const contentWidth = Math.max(maxChars * charWidth, 320);
  const windowWidth = Math.round(contentWidth + gutterWidth + 36);
  const windowHeight = Math.round(headerHeight + lineCount * lineHeight + footerHeight);

  const totalWidth = windowWidth + padding * 2;
  const totalHeight = windowHeight + padding * 2;

  const parts: string[] = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">`);
  parts.push('  <defs>');
  parts.push('    <filter id="preview-shadow" x="-10%" y="-10%" width="130%" height="130%">');
  parts.push('      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.55"/>');
  parts.push('    </filter>');

  if (bgStops.length > 0) {
    parts.push('    <linearGradient id="preview-bg" x1="0%" y1="0%" x2="100%" y2="100%">');
    for (const [stopColor, stopOffset] of bgStops) {
      parts.push(`      <stop offset="${stopOffset}" stop-color="${stopColor}"/>`);
    }
    parts.push('    </linearGradient>');
  }
  parts.push('  </defs>');

  // Background
  if (backgroundId !== 'transparent') {
    const bgFill = bgStops.length > 0 ? 'url(#preview-bg)' : '#18181b';
    parts.push(`  <rect width="${totalWidth}" height="${totalHeight}" rx="20" fill="${bgFill}"/>`);
  }

  // Window rect
  const winX = padding;
  const winY = padding;
  parts.push('  <g filter="url(#preview-shadow)">');
  parts.push(`    <rect x="${winX}" y="${winY}" width="${windowWidth}" height="${windowHeight}" rx="14" fill="${theme.background}" stroke="${theme.border}" stroke-width="1"/>`);
  parts.push('  </g>');

  // Window Header Chrome
  if (frameStyle !== 'none') {
    parts.push(`  <path d="M ${winX} ${winY + 14} A 14 14 0 0 1 ${winX + 14} ${winY} L ${winX + windowWidth - 14} ${winY} A 14 14 0 0 1 ${winX + windowWidth} ${winY + 14} L ${winX + windowWidth} ${winY + headerHeight} L ${winX} ${winY + headerHeight} Z" fill="${theme.headerBg}"/>`);
    parts.push(`  <line x1="${winX}" y1="${winY + headerHeight}" x2="${winX + windowWidth}" y2="${winY + headerHeight}" stroke="${theme.border}" stroke-width="1"/>`);

    if (frameStyle === 'macos') {
      const dotY = winY + Math.round(headerHeight / 2);
      parts.push(`  <circle cx="${winX + 18}" cy="${dotY}" r="5.5" fill="#ff5f56"/>`);
      parts.push(`  <circle cx="${winX + 34}" cy="${dotY}" r="5.5" fill="#ffbd2e"/>`);
      parts.push(`  <circle cx="${winX + 50}" cy="${dotY}" r="5.5" fill="#27c93f"/>`);
    } else if (frameStyle === 'terminal') {
      const textY = winY + 26;
      parts.push(`  <text x="${winX + 16}" y="${textY}" font-family="JetBrains Mono, monospace" font-size="12" fill="#10b981" font-weight="600">$</text>`);
      parts.push(`  <text x="${winX + 28}" y="${textY}" font-family="JetBrains Mono, monospace" font-size="12" fill="${theme.foreground}" opacity="0.8">bash</text>`);
    } else if (frameStyle === 'windows') {
      const rx = winX + windowWidth - 48;
      const ry = winY + 14;
      parts.push(`  <line x1="${rx}" y1="${ry + 6}" x2="${rx + 8}" y2="${ry + 6}" stroke="${theme.foreground}" stroke-width="1"/>`);
      parts.push(`  <rect x="${rx + 14}" y="${ry + 2}" width="8" height="8" fill="none" stroke="${theme.foreground}" stroke-width="1"/>`);
      parts.push(`  <path d="M ${rx + 28} ${ry + 2} L ${rx + 36} ${ry + 10} M ${rx + 36} ${ry + 2} L ${rx + 28} ${ry + 10}" stroke="${theme.foreground}" stroke-width="1"/>`);
    }

    // Title
    const titleX = winX + Math.round(windowWidth / 2);
    const titleY = winY + 26;
    parts.push(`  <text x="${titleX}" y="${titleY}" font-family="JetBrains Mono, -apple-system, monospace" font-size="12" fill="${theme.foreground}" opacity="0.65" text-anchor="middle">${escapeXml(fileName)}</text>`);
  }

  // Code Lines
  const codeStartY = winY + headerHeight + 22;
  const lineNumX = winX + 16;
  const codeStartX = winX + gutterWidth + 12;

  rawLines.forEach((rawLine, idx) => {
    const lineY = codeStartY + idx * lineHeight;

    if (showLineNumbers) {
      parts.push(`  <text x="${lineNumX}" y="${lineY}" font-family="JetBrains Mono, monospace" font-size="12" fill="${theme.comment}" opacity="0.45" text-anchor="start">${idx + 1}</text>`);
    }

    const tokens = simpleTokenize(rawLine, theme);
    let curX = codeStartX;

    for (const t of tokens) {
      if (!t.text) continue;
      parts.push(`  <text x="${curX}" y="${lineY}" font-family="JetBrains Mono, monospace" font-size="13" fill="${t.color}" xml:space="preserve">${escapeXml(t.text)}</text>`);
      curX += t.text.length * charWidth;
    }
  });

  // Watermark
  const wmX = winX + windowWidth - 16;
  const wmY = winY + windowHeight - 10;
  parts.push(`  <text x="${wmX}" y="${wmY}" font-family="JetBrains Mono, monospace" font-size="9" fill="${theme.foreground}" opacity="0.3" text-anchor="end">DevPaper</text>`);

  parts.push('</svg>');
  return parts.join('\n');
}

