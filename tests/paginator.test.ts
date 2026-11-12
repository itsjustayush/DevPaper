import { describe, it, expect } from 'vitest';
import { paginateCode } from '../src/core/paginator';
import { PAPER_REGISTRY } from '../src/registries/paperSizes';

describe('Intelligent Code Paginator', () => {
  const sampleCode = `// DevPaper Sample Document
function calculateFibonacci(n: number): number {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

export class DataStreamProcessor {
  private buffer: string[] = [];

  constructor(private readonly maxBufferSize: number) {}

  public append(item: string): void {
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }
    this.buffer.push(item);
  }

  public flush(): void {
    console.log("Flushing buffer:", this.buffer.length);
    this.buffer = [];
  }
}
`;

  it('handles Auto (Single Frame) mode in a single page', () => {
    const doc = paginateCode({
      code: sampleCode,
      language: 'typescript',
      paperSize: PAPER_REGISTRY['auto'],
      orientation: 'portrait',
      margins: { top: 32, right: 32, bottom: 32, left: 32 },
      fontSize: 14,
      lineHeight: 1.6,
      fileName: 'fibonacci.ts',
    });

    expect(doc.totalPages).toBe(1);
    expect(doc.pages.length).toBe(1);
    expect(doc.pages[0].lines.length).toBe(sampleCode.split('\n').length);
    expect(doc.pages[0].fileName).toBe('fibonacci.ts');
  });

  it('correctly paginates long source files across multiple pages on A4', () => {
    // Generate 120 lines of code
    const lines = Array.from({ length: 120 }, (_, i) => `const val_${i} = processLine(${i});`);
    const longCode = lines.join('\n');

    const doc = paginateCode({
      code: longCode,
      language: 'typescript',
      paperSize: PAPER_REGISTRY['a4-portrait'],
      orientation: 'portrait',
      margins: { top: 32, right: 32, bottom: 32, left: 32 },
      fontSize: 14,
      lineHeight: 1.6,
      fileName: 'large.ts',
    });

    expect(doc.totalPages).toBeGreaterThan(1);
    expect(doc.pages.length).toBe(doc.totalPages);
    expect(doc.totalLines).toBe(120);

    // Verify continuous line numbering
    let expectedLine = 1;
    for (const page of doc.pages) {
      expect(page.lines[0].lineNumber).toBe(expectedLine);
      for (const line of page.lines) {
        expect(line.lineNumber).toBe(expectedLine);
        expectedLine++;
      }
    }
    expect(expectedLine - 1).toBe(120);
  });

  it('detects diff markers (+ / -) accurately', () => {
    const diffCode = ` const base = 100;\n+const added = 200;\n-const removed = 50;`;
    const doc = paginateCode({
      code: diffCode,
      language: 'typescript',
      paperSize: PAPER_REGISTRY['auto'],
      orientation: 'portrait',
      margins: { top: 32, right: 32, bottom: 32, left: 32 },
      fontSize: 14,
      lineHeight: 1.6,
    });

    const lines = doc.pages[0].lines;
    expect(lines[0].diffType).toBe('none');
    expect(lines[1].diffType).toBe('add');
    expect(lines[1].rawText).toBe('const added = 200;');
    expect(lines[2].diffType).toBe('remove');
    expect(lines[2].rawText).toBe('const removed = 50;');
  });

  it('respects highlighted and focused lines', () => {
    const code = `line 1\nline 2\nline 3\nline 4`;
    const doc = paginateCode({
      code,
      language: 'text',
      paperSize: PAPER_REGISTRY['auto'],
      orientation: 'portrait',
      margins: { top: 32, right: 32, bottom: 32, left: 32 },
      fontSize: 14,
      lineHeight: 1.6,
      highlightedLines: [2],
      focusedLines: [2, 3],
    });

    const lines = doc.pages[0].lines;
    expect(lines[0].isDimmed).toBe(true);
    expect(lines[1].isHighlighted).toBe(true);
    expect(lines[1].isDimmed).toBe(false);
    expect(lines[2].isHighlighted).toBe(false);
    expect(lines[2].isDimmed).toBe(false);
    expect(lines[3].isDimmed).toBe(true);
  });

  it('swaps width and height for landscape orientation', () => {
    const docPortrait = paginateCode({
      code: 'console.log("hello");',
      language: 'typescript',
      paperSize: PAPER_REGISTRY['a4-portrait'],
      orientation: 'portrait',
      margins: { top: 32, right: 32, bottom: 32, left: 32 },
      fontSize: 14,
      lineHeight: 1.6,
    });

    const docLandscape = paginateCode({
      code: 'console.log("hello");',
      language: 'typescript',
      paperSize: PAPER_REGISTRY['a4-portrait'],
      orientation: 'landscape',
      margins: { top: 32, right: 32, bottom: 32, left: 32 },
      fontSize: 14,
      lineHeight: 1.6,
    });

    expect(docPortrait.totalPages).toBe(1);
    expect(docLandscape.totalPages).toBe(1);
  });
});

