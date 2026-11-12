export type ThemeType = 'dark' | 'light';

export interface SyntaxTokens {
  keywords: string;
  strings: string;
  functions: string;
  variables: string;
  comments: string;
  numbers: string;
  operators: string;
  types: string;
  punctuation: string;
  tags?: string;
  attributes?: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  type: ThemeType;
  background: string;
  foreground: string;
  selection: string;
  cursor: string;
  lineHighlight: string;
  diffAdd: string;
  diffRemove: string;
  syntax: SyntaxTokens;
  shikiTheme: string;
  accent?: string;
  border?: string;
}

export interface FontDefinition {
  id: string;
  name: string;
  fontFamily: string;
  category: 'monospace' | 'sans' | 'serif';
  ligatures: boolean;
  weights: number[];
  webFontUrl?: string;
  sampleCode?: string;
}

export type FrameStyle = 
  | 'macos-filled' 
  | 'macos-outline' 
  | 'macos-monochrome' 
  | 'windows' 
  | 'terminal' 
  | 'browser' 
  | 'minimal' 
  | 'none';

export interface FrameDefinition {
  id: string;
  name: string;
  style: FrameStyle;
  hasHeader: boolean;
  description: string;
}

export type PaperCategory = 'auto' | 'print' | 'presentation' | 'social';
export type PageOrientation = 'portrait' | 'landscape';

export interface PaperPreset {
  id: string;
  name: string;
  category: PaperCategory;
  widthMm?: number;
  heightMm?: number;
  widthPx: number;
  heightPx: number;
  dpi: number;
  aspectRatio?: string;
  description?: string;
}

export type BackgroundType = 'gradient' | 'mesh' | 'solid' | 'image' | 'transparent';

export interface BackgroundPreset {
  id: string;
  name: string;
  type: BackgroundType;
  value: string; // CSS background value or url
  angle?: number;
}

export type DiffType = 'add' | 'remove' | 'none';

export interface PaginatedLine {
  lineNumber: number;
  rawText: string;
  diffType?: DiffType;
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

export interface PaginatedPage {
  pageNumber: number;
  totalPages: number;
  startLineIndex: number;
  endLineIndex: number;
  lines: PaginatedLine[];
  fileName?: string;
  sectionTitle?: string;
}

export interface DocumentMetadata {
  title: string;
  author: string;
  repository?: string;
  license?: string;
  createdAt: string;
}

export interface PaginatorMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PaginatorOptions {
  code: string;
  language: string;
  paperSize: PaperPreset;
  orientation: PageOrientation;
  margins: PaginatorMargins;
  fontSize: number;
  lineHeight: number;
  preserveBlocks?: boolean;
  headerHeight?: number;
  footerHeight?: number;
  lineWrapping?: boolean;
  tabSize?: number;
  startingLineNumber?: number;
  highlightedLines?: number[];
  focusedLines?: number[];
  metadata?: Partial<DocumentMetadata>;
  fileName?: string;
}

export interface PaginatedDocument {
  pages: PaginatedPage[];
  totalLines: number;
  totalPages: number;
  metadata: DocumentMetadata;
}

export interface SourceFileItem {
  id: string;
  name: string;
  language: string;
  code: string;
  highlightedLines?: number[];
}

export interface DevPaperState {
  mode: 'canvas' | 'codepaper';
  activeFileId: string;
  files: SourceFileItem[];
  themeId: string;
  fontId: string;
  fontSize: number;
  lineHeight: number;
  frameId: string;
  backgroundId: string;
  customBackground?: string;
  showLineNumbers: boolean;
  startingLineNumber: number;
  tabSize: number;
  lineWrapping: boolean;
  windowPadding: number;
  canvasPadding: number;
  borderRadius: number;
  dropShadow: string;
  windowOpacity: number;
  watermarkText: string;
  showWatermark: boolean;
  fileName: string;
  paperSizeId: string;
  orientation: PageOrientation;
  preserveBlocks: boolean;
  margins: PaginatorMargins;
  docTitle: string;
  docAuthor: string;
  docRepo: string;
}
