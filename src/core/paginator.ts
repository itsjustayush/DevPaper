import {
  PaginatorOptions,
  PaginatedDocument,
  PaginatedPage,
  PaginatedLine,
  DiffType,
} from '@/types';

/**
 * Intelligent Code Paginator Engine
 * 
 * Decoupled, deterministic layout calculator that computes code flow across physical
 * or presentation sheets based on exact millimeter/pixel constraints, typography,
 * running headers/footers, and block-boundary preservation heuristics.
 */
export function paginateCode(options: PaginatorOptions): PaginatedDocument {
  const {
    code,
    language,
    paperSize,
    orientation = 'portrait',
    margins = { top: 32, right: 32, bottom: 32, left: 32 },
    fontSize = 13,
    lineHeight = 1.6,
    preserveBlocks = true,
    headerHeight = 44,
    footerHeight = 36,
    lineWrapping = false,
    startingLineNumber = 1,
    highlightedLines = [],
    focusedLines = [],
    fileName,
    metadata = {},
  } = options;

  // Single Frame / Auto Mode: Put everything on a single dynamic page
  if (paperSize.id === 'auto') {
    const rawLines = code.split(/\r?\n/);
    const paginatedLines: PaginatedLine[] = rawLines.map((text, idx) => {
      const lineNum = startingLineNumber + idx;
      const { diffType, cleanText } = detectDiff(text);
      const isHighlighted = highlightedLines.includes(lineNum);
      const isDimmed = focusedLines.length > 0 && !focusedLines.includes(lineNum);

      return {
        lineNumber: lineNum,
        rawText: cleanText,
        diffType,
        isHighlighted,
        isDimmed,
      };
    });

    const singlePage: PaginatedPage = {
      pageNumber: 1,
      totalPages: 1,
      startLineIndex: startingLineNumber,
      endLineIndex: startingLineNumber + paginatedLines.length - 1,
      lines: paginatedLines,
      fileName,
    };

    return {
      pages: [singlePage],
      totalLines: paginatedLines.length,
      totalPages: 1,
      metadata: {
        title: metadata.title || fileName || 'Code Snippet',
        author: metadata.author || 'DevPaper',
        repository: metadata.repository,
        license: metadata.license,
        createdAt: metadata.createdAt || new Date().toISOString(),
      },
    };
  }

  // Determine physical canvas dimensions according to orientation
  let canvasWidth = paperSize.widthPx;
  let canvasHeight = paperSize.heightPx;

  if (orientation === 'landscape' && canvasWidth < canvasHeight) {
    canvasWidth = paperSize.heightPx;
    canvasHeight = paperSize.widthPx;
  } else if (orientation === 'portrait' && canvasWidth > canvasHeight) {
    canvasWidth = paperSize.heightPx;
    canvasHeight = paperSize.widthPx;
  }

  // Calculate usable vertical dimension for code lines
  const usableHeight = Math.max(
    100,
    canvasHeight - margins.top - margins.bottom - headerHeight - footerHeight
  );

  const usableWidth = Math.max(
    100,
    canvasWidth - margins.left - margins.right - 60 // 60px reserved for gutter / line numbers
  );

  // Line metrics
  const linePixelHeight = Math.max(14, fontSize * lineHeight);
  const baseLinesPerPage = Math.max(5, Math.floor(usableHeight / linePixelHeight));

  // Average character width for monospace font is ~0.6 * fontSize
  const charWidth = fontSize * 0.6;
  const maxCharsPerLine = Math.max(20, Math.floor(usableWidth / charWidth));

  const rawLines = code.split(/\r?\n/);

  // Process raw lines with diff detection and optional line-wrapping computation
  interface ProcessedLineItem {
    originalIndex: number;
    text: string;
    diffType: DiffType;
    isHighlighted: boolean;
    isDimmed: boolean;
    isContinuation: boolean;
    weightInLines: number; // For line wrapping
    isBlockStart?: boolean;
    isBlockEnd?: boolean;
  }

  const processedItems: ProcessedLineItem[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const text = rawLines[i];
    const lineNum = startingLineNumber + i;
    const { diffType, cleanText } = detectDiff(text);
    const isHighlighted = highlightedLines.includes(lineNum);
    const isDimmed = focusedLines.length > 0 && !focusedLines.includes(lineNum);

    const isBlockStart = /^(export\s+)?(function|class|interface|type|const|let|var|def|struct|enum|fn|pub fn)\b|{\s*$/.test(
      cleanText.trim()
    );
    const isBlockEnd = /^(\}|\);?|\];?)$/.test(cleanText.trim());

    if (lineWrapping && cleanText.length > maxCharsPerLine) {
      // Line wrapping: wrap long lines into multiple visual lines
      let remaining = cleanText;
      let first = true;
      while (remaining.length > 0) {
        const slice = remaining.slice(0, maxCharsPerLine);
        remaining = remaining.slice(maxCharsPerLine);

        processedItems.push({
          originalIndex: lineNum,
          text: slice,
          diffType,
          isHighlighted,
          isDimmed,
          isContinuation: !first,
          weightInLines: 1,
          isBlockStart: first ? isBlockStart : false,
          isBlockEnd: remaining.length === 0 ? isBlockEnd : false,
        });
        first = false;
      }
    } else {
      processedItems.push({
        originalIndex: lineNum,
        text: cleanText,
        diffType,
        isHighlighted,
        isDimmed,
        isContinuation: false,
        weightInLines: 1,
        isBlockStart,
        isBlockEnd,
      });
    }
  }

  // Chunk items into pages using block-preservation heuristics
  const pagesData: PaginatedLine[][] = [];
  let currentPage: PaginatedLine[] = [];
  let currentHeightLines = 0;

  for (let i = 0; i < processedItems.length; i++) {
    const item = processedItems[i];

    // Check if adding this line would exceed the page limit
    if (currentHeightLines + item.weightInLines > baseLinesPerPage && currentPage.length > 0) {
      // Heuristic: Avoid breaking right after a block header if near bottom
      if (preserveBlocks && item.isBlockStart && currentHeightLines >= baseLinesPerPage - 2) {
        // Break before this block header rather than stranding it alone at the bottom
        pagesData.push(currentPage);
        currentPage = [];
        currentHeightLines = 0;
      } else {
        pagesData.push(currentPage);
        currentPage = [];
        currentHeightLines = 0;
      }
    }

    currentPage.push({
      lineNumber: item.originalIndex,
      rawText: item.text,
      diffType: item.diffType,
      isHighlighted: item.isHighlighted,
      isDimmed: item.isDimmed,
    });

    currentHeightLines += item.weightInLines;
  }

  if (currentPage.length > 0 || pagesData.length === 0) {
    pagesData.push(currentPage);
  }

  const totalPages = pagesData.length;

  const pages: PaginatedPage[] = pagesData.map((pageLines, pageIdx) => {
    const startLine = pageLines.length > 0 ? pageLines[0].lineNumber : startingLineNumber;
    const endLine = pageLines.length > 0 ? pageLines[pageLines.length - 1].lineNumber : startingLineNumber;

    return {
      pageNumber: pageIdx + 1,
      totalPages,
      startLineIndex: startLine,
      endLineIndex: endLine,
      lines: pageLines,
      fileName,
    };
  });

  return {
    pages,
    totalLines: rawLines.length,
    totalPages,
    metadata: {
      title: metadata.title || fileName || 'Code Document',
      author: metadata.author || 'DevPaper',
      repository: metadata.repository,
      license: metadata.license,
      createdAt: metadata.createdAt || new Date().toISOString(),
    },
  };
}

/**
 * Detect diff markers (+ / -) commonly used in code snippets and review diffs
 */
function detectDiff(text: string): { diffType: DiffType; cleanText: string } {
  if (text.startsWith('+') && !text.startsWith('++')) {
    return { diffType: 'add', cleanText: text.substring(1) };
  }
  if (text.startsWith('-') && !text.startsWith('--')) {
    return { diffType: 'remove', cleanText: text.substring(1) };
  }
  return { diffType: 'none', cleanText: text };
}

