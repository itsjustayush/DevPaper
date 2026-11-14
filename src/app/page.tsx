'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { SnippetCanvas, SnippetCanvasHandle } from '@/components/canvas/SnippetCanvas';
import { FloatingDock } from '@/components/dock/FloatingDock';
import { ExportStudioModal } from '@/components/export/ExportStudioModal';
import { paginateCode } from '@/core/paginator';
import { getThemeById } from '@/registries/themes';
import { getFontById } from '@/registries/fonts';
import { getFrameById } from '@/registries/frames';
import { getPaperSizeById } from '@/registries/paperSizes';
import { getBackgroundById } from '@/registries/backgrounds';
import { detectLanguage } from '@/core/syntax';
import {
  exportElementAsImage,
  copyImageToClipboard,
  exportElementAsSvg,
  exportElementsAsPdf,
  exportElementsAsZip,
} from '@/core/exporters';
import { PageOrientation, PaginatorMargins } from '@/types';

const INITIAL_CODE = `// DevPaper — Code Presentation & Typesetting Studio
// Transforms code into beautiful images and multi-page printable documents

import { useState, useEffect } from 'react';

interface StreamOptions<T> {
  bufferSize: number;
  flushIntervalMs: number;
  onFlush: (batch: T[]) => Promise<void>;
}

export class HighThroughputPipeline<T> {
  private queue: T[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly config: StreamOptions<T>) {
    this.startPeriodicFlush();
  }

  + // Added in v1.2: Thread-safe batch ingestion
  + public enqueue(item: T): void {
  +   this.queue.push(item);
  +   if (this.queue.length >= this.config.bufferSize) {
  +     this.flushSync();
  +   }
  + }

  - private oldSynchronousFlush(): void {
  -   // Deprecated legacy bottleneck
  -   this.queue = [];
  - }

  public async flushSync(): Promise<void> {
    if (this.queue.length === 0) return;
    const batch = this.queue.splice(0, this.config.bufferSize);
    await this.config.onFlush(batch);
  }

  private startPeriodicFlush(): void {
    this.timer = setInterval(() => this.flushSync(), this.config.flushIntervalMs);
  }
}
`;

export default function DevPaperHome() {
  // Primary code & file state (Unified, content-aware workspace)
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [fileName, setFileName] = useState<string>('pipeline.ts');
  const [language, setLanguage] = useState<string>('typescript');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(true);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  // Studio customization state
  const [themeId, setThemeId] = useState<string>('tokyo-night');
  const [fontId, setFontId] = useState<string>('jetbrains-mono');
  const [fontSize, setFontSize] = useState<number>(13);
  const [lineHeight, setLineHeight] = useState<number>(1.6);
  const [frameId, setFrameId] = useState<string>('macos-filled');
  const [paperSizeId, setPaperSizeId] = useState<string>('auto');
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [preserveBlocks, setPreserveBlocks] = useState<boolean>(true);
  const [backgroundId, setBackgroundId] = useState<string>('cosmic-sunset');
  const [canvasPadding, setCanvasPadding] = useState<number>(64);
  const [borderRadius, setBorderRadius] = useState<number>(16);
  const [dropShadow, setDropShadow] = useState<string>(
    '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
  );
  const [windowOpacity, setWindowOpacity] = useState<number>(1);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [lineWrapping, setLineWrapping] = useState<boolean>(false);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [watermarkText, setWatermarkText] = useState<string>('DevPaper Typesetting Studio');

  // UI state
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [quickCopied, setQuickCopied] = useState<boolean>(false);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Hidden File Input for direct file opening (main.py, index.html, etc.)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setCode(text);
        setFileName(file.name);
        const detected = detectLanguage(file.name, text);
        if (detected) {
          setLanguage(detected);
          setIsAutoDetected(true);
        }
      }
    };
    reader.readAsText(file);
  }, []);

  // Document Margins
  const margins: PaginatorMargins = useMemo(() => ({
    top: 32,
    right: 32,
    bottom: 32,
    left: 32,
  }), []);

  // Registry resolutions
  const theme = useMemo(() => getThemeById(themeId), [themeId]);
  const font = useMemo(() => getFontById(fontId), [fontId]);
  const frame = useMemo(() => getFrameById(frameId), [frameId]);
  const paperSize = useMemo(() => getPaperSizeById(paperSizeId), [paperSizeId]);
  const background = useMemo(() => getBackgroundById(backgroundId), [backgroundId]);

  // Canvas Reference
  const canvasRef = useRef<SnippetCanvasHandle>(null);

  // Code update with content-aware language detection
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    if (isAutoDetected) {
      const detected = detectLanguage(fileName, newCode);
      if (detected && detected !== language) {
        setLanguage(detected);
      }
    }
  }, [fileName, isAutoDetected, language]);

  // Language update handler
  const handleLanguageChange = useCallback((newLang: string, auto: boolean = false) => {
    setLanguage(newLang);
    setIsAutoDetected(auto);
  }, []);

  // Filename update handler
  const handleFileNameChange = useCallback((newName: string) => {
    setFileName(newName);
    if (isAutoDetected) {
      const detected = detectLanguage(newName, code);
      if (detected) {
        setLanguage(detected);
      }
    }
  }, [code, isAutoDetected]);

  // Toggle line highlighting
  const handleToggleLineHighlight = useCallback((lineNum: number) => {
    setHighlightedLines((prev) =>
      prev.includes(lineNum) ? prev.filter((n) => n !== lineNum) : [...prev, lineNum]
    );
  }, []);

  // Compute pagination
  const documentData = useMemo(() => {
    return paginateCode({
      code,
      language,
      paperSize,
      orientation,
      margins,
      fontSize,
      lineHeight,
      preserveBlocks,
      lineWrapping,
      highlightedLines,
      fileName,
      metadata: {
        title: fileName,
        author: watermarkText,
      },
    });
  }, [
    code,
    language,
    paperSize,
    orientation,
    margins,
    fontSize,
    lineHeight,
    preserveBlocks,
    lineWrapping,
    highlightedLines,
    fileName,
    watermarkText,
  ]);

  // State Persistence & URL Sharing
  const handleShareUrl = () => {
    try {
      const statePayload = {
        themeId,
        fontId,
        fontSize,
        lineHeight,
        frameId,
        paperSizeId,
        backgroundId,
        canvasPadding,
        borderRadius,
        code,
        language,
        fileName,
      };
      const json = JSON.stringify(statePayload);
      const encoded = btoa(encodeURIComponent(json));
      const url = new URL(window.location.href);
      url.hash = `dp=${encoded}`;
      navigator.clipboard.writeText(url.toString());
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch (e) {
      console.error('Failed to create share URL:', e);
    }
  };

  // Read URL Hash on Mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#dp=')) {
        const raw = hash.replace('#dp=', '');
        const decoded = decodeURIComponent(atob(raw));
        const parsed = JSON.parse(decoded);
        if (parsed.themeId) setThemeId(parsed.themeId);
        if (parsed.fontId) setFontId(parsed.fontId);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.frameId) setFrameId(parsed.frameId);
        if (parsed.paperSizeId) setPaperSizeId(parsed.paperSizeId);
        if (parsed.backgroundId) setBackgroundId(parsed.backgroundId);
        if (parsed.code) setCode(parsed.code);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.fileName) setFileName(parsed.fileName);
      }
    } catch (e) {
      console.warn('Could not parse share hash:', e);
    }
  }, []);

  // Pre-warm font engine on mount & font changes for instant sub-100ms downloads
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.catch(() => {});
    }
  }, [fontId]);

  // Quick Copy Action
  const handleCopyClipboard = async () => {
    const isMultiPage = documentData.totalPages > 1 && paperSize.id !== 'auto';
    const pageEls = canvasRef.current?.getPageElements();
    const targetEl = isMultiPage && pageEls && pageEls.length > 0
      ? pageEls[0]
      : canvasRef.current?.getCanvasElement();

    if (!targetEl) throw new Error('Canvas element not available.');
    await copyImageToClipboard(targetEl, 2);
    setQuickCopied(true);
    setTimeout(() => setQuickCopied(false), 2000);
  };

  // Export handlers
  const handleExportPng = async (scale: number) => {
    const isMultiPage = documentData.totalPages > 1 && paperSize.id !== 'auto';
    const pageEls = canvasRef.current?.getPageElements();
    const targetEl = isMultiPage && pageEls && pageEls.length > 0
      ? pageEls[0]
      : canvasRef.current?.getCanvasElement();

    if (!targetEl) throw new Error('Canvas element not available.');
    await exportElementAsImage(targetEl, {
      pixelRatio: scale,
      fileName: isMultiPage ? `${fileName.replace(/\.[^/.]+$/, '')}-page-01` : fileName.replace(/\.[^/.]+$/, ''),
      format: 'png',
    });
  };

  const handleExportSvg = async () => {
    const isMultiPage = documentData.totalPages > 1 && paperSize.id !== 'auto';
    const pageEls = canvasRef.current?.getPageElements();
    const targetEl = isMultiPage && pageEls && pageEls.length > 0
      ? pageEls[0]
      : canvasRef.current?.getCanvasElement();

    if (!targetEl) throw new Error('Canvas element not available.');
    await exportElementAsSvg(targetEl, {
      fileName: isMultiPage ? `${fileName.replace(/\.[^/.]+$/, '')}-page-01` : fileName.replace(/\.[^/.]+$/, ''),
    });
  };

  const handleExportPdf = async (onProgress?: (current: number, total: number) => void) => {
    const pageEls = canvasRef.current?.getPageElements();
    if (!pageEls || pageEls.length === 0) throw new Error('No pages available for PDF export.');
    await exportElementsAsPdf(pageEls, {
      paperSize,
      orientation,
      fileName: fileName.replace(/\.[^/.]+$/, ''),
      metadata: {
        title: fileName,
        author: watermarkText,
      },
      onProgress,
    });
  };

  const handleExportZip = async (format: 'png' | 'svg', onProgress?: (current: number, total: number) => void) => {
    const pageEls = canvasRef.current?.getPageElements();
    if (!pageEls || pageEls.length === 0) throw new Error('No pages available for ZIP export.');
    await exportElementsAsZip(pageEls, {
      fileName: fileName.replace(/\.[^/.]+$/, ''),
      format,
      pixelRatio: 2,
      onProgress,
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#090a0f] text-zinc-100 antialiased selection:bg-emerald-500/30 relative"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingFile(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDraggingFile(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingFile(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileSelect(e.dataTransfer.files[0]);
        }
      }}
    >
      {/* Hidden File Picker Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".py,.ts,.tsx,.js,.jsx,.rs,.go,.c,.cpp,.h,.hpp,.html,.css,.json,.yaml,.yml,.sql,.sh,.bash,.md,.txt,.java,.kt,.swift,.php,.rb"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Drag & Drop Overlay */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700 text-center space-y-2">
            <span className="text-2xl">📄</span>
            <p className="text-sm font-semibold text-zinc-100">Drop code file to open</p>
            <p className="text-xs text-zinc-400">Supports .py, .ts, .html, .rs, .go, .sql, and 100+ formats</p>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        onShareUrl={handleShareUrl}
        shareCopied={shareCopied}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onQuickCopy={handleCopyClipboard}
        quickCopied={quickCopied}
        onOpenFile={() => fileInputRef.current?.click()}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 pt-20 pb-28 px-4 sm:px-8 max-w-7xl mx-auto w-full flex flex-col items-center gap-6">
        {/* Live Code Composition Canvas (Direct In-Window Editing) */}
        <div className="w-full flex justify-center animate-in fade-in duration-300">
          <SnippetCanvas
            ref={canvasRef}
            documentData={documentData}
            code={code}
            onCodeChange={handleCodeChange}
            language={language}
            isAutoDetected={isAutoDetected}
            onLanguageChange={handleLanguageChange}
            fileName={fileName}
            onFileNameChange={handleFileNameChange}
            highlightedLines={highlightedLines}
            onToggleLineHighlight={handleToggleLineHighlight}
            paperSize={paperSize}
            orientation={orientation}
            theme={theme}
            font={font}
            frame={frame}
            background={background}
            fontSize={fontSize}
            lineHeight={lineHeight}
            showLineNumbers={showLineNumbers}
            lineWrapping={lineWrapping}
            canvasPadding={canvasPadding}
            borderRadius={borderRadius}
            dropShadow={dropShadow}
            windowOpacity={windowOpacity}
            margins={margins}
            docTitle={fileName}
            docAuthor={watermarkText}
            docRepo="github.com/DevPaper/devpaper"
            showWatermark={showWatermark}
            watermarkText={watermarkText}
          />
        </div>
      </main>

      {/* Floating Control Dock (Themes, Fonts, Frame, Canvas, Options, Export) */}
      <FloatingDock
        currentThemeId={themeId}
        currentFontId={fontId}
        fontSize={fontSize}
        lineHeight={lineHeight}
        currentFrameId={frameId}
        currentBgId={backgroundId}
        canvasPadding={canvasPadding}
        borderRadius={borderRadius}
        windowOpacity={windowOpacity}
        showLineNumbers={showLineNumbers}
        lineWrapping={lineWrapping}
        showWatermark={showWatermark}
        watermarkText={watermarkText}
        onSelectTheme={setThemeId}
        onSelectFont={setFontId}
        onChangeFontSize={setFontSize}
        onChangeLineHeight={setLineHeight}
        onSelectFrame={setFrameId}
        onSelectBackground={setBackgroundId}
        onChangePadding={setCanvasPadding}
        onChangeBorderRadius={setBorderRadius}
        onChangeOpacity={setWindowOpacity}
        onToggleLineNumbers={() => setShowLineNumbers((p) => !p)}
        onToggleLineWrapping={() => setLineWrapping((p) => !p)}
        onToggleWatermark={() => setShowWatermark((p) => !p)}
        onChangeWatermarkText={setWatermarkText}
        onCopyClipboard={handleCopyClipboard}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Export & Sizing Studio Dialog */}
      <ExportStudioModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        fileName={fileName}
        code={code}
        pageCount={documentData.totalPages}
        totalLines={documentData.totalLines}
        currentPaperId={paperSizeId}
        orientation={orientation}
        preserveBlocks={preserveBlocks}
        onSelectPaper={setPaperSizeId}
        onSelectOrientation={setOrientation}
        onTogglePreserveBlocks={setPreserveBlocks}
        onCopyClipboard={handleCopyClipboard}
        onExportPng={handleExportPng}
        onExportSvg={handleExportSvg}
        onExportPdf={handleExportPdf}
        onExportZip={handleExportZip}
      />
    </div>
  );
}
