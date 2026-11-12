'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { SnippetCanvas, SnippetCanvasHandle } from '@/components/canvas/SnippetCanvas';
import { FloatingDock } from '@/components/dock/FloatingDock';
import { CodeEditorArea } from '@/components/editor/CodeEditorArea';
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
import { PageOrientation, PaginatorMargins, SourceFileItem } from '@/types';
import { ChevronDown, ChevronUp, Sliders } from 'lucide-react';

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
  const [mode, setMode] = useState<'canvas' | 'codepaper'>('canvas');

  // Source files list for multi-file documents
  const [files, setFiles] = useState<SourceFileItem[]>([
    {
      id: 'file-1',
      name: 'pipeline.ts',
      language: 'typescript',
      code: INITIAL_CODE,
    },
  ]);
  const [activeFileId, setActiveFileId] = useState<string>('file-1');

  // Customization state
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
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [showEditorDrawer, setShowEditorDrawer] = useState<boolean>(false);

  // Margins for paginated document
  const margins: PaginatorMargins = useMemo(() => ({
    top: 32,
    right: 32,
    bottom: 32,
    left: 32,
  }), []);

  // Active file resolution
  const activeFile = useMemo(() => {
    return files.find((f) => f.id === activeFileId) || files[0];
  }, [files, activeFileId]);

  // Lookup registry objects
  const theme = useMemo(() => getThemeById(themeId), [themeId]);
  const font = useMemo(() => getFontById(fontId), [fontId]);
  const frame = useMemo(() => getFrameById(frameId), [frameId]);
  const paperSize = useMemo(() => getPaperSizeById(paperSizeId), [paperSizeId]);
  const background = useMemo(() => getBackgroundById(backgroundId), [backgroundId]);

  // Canvas Reference for export engines
  const canvasRef = useRef<SnippetCanvasHandle>(null);

  // Auto-switch paper preset when entering/leaving CodePaper mode
  const handleModeChange = (newMode: 'canvas' | 'codepaper') => {
    setMode(newMode);
    if (newMode === 'codepaper' && paperSizeId === 'auto') {
      setPaperSizeId('a4-portrait');
      setCanvasPadding(32);
    } else if (newMode === 'canvas' && paperSizeId !== 'auto') {
      setPaperSizeId('auto');
      setCanvasPadding(64);
    }
  };

  // Modify active file
  const handleCodeChange = (newCode: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFile.id ? { ...f, code: newCode } : f))
    );
  };

  const handleLanguageChange = (newLang: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFile.id ? { ...f, language: newLang } : f))
    );
  };

  const handleFileNameChange = (newName: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFile.id ? { ...f, name: newName } : f))
    );
  };

  const handleAutoDetect = () => {
    const detected = detectLanguage(activeFile.name, activeFile.code);
    handleLanguageChange(detected);
  };

  // Multi-file management
  const handleAddFile = () => {
    const newId = `file-${Date.now()}`;
    const newFile: SourceFileItem = {
      id: newId,
      name: `module-${files.length + 1}.ts`,
      language: 'typescript',
      code: `// File ${files.length + 1}\nexport function execute() {\n  return "ok";\n}`,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newId);
  };

  const handleDeleteFile = (idToDelete: string) => {
    if (files.length <= 1) return;
    const remaining = files.filter((f) => f.id !== idToDelete);
    setFiles(remaining);
    if (activeFileId === idToDelete) {
      setActiveFileId(remaining[0].id);
    }
  };

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
        code: activeFile.code,
        language: activeFile.language,
        fileName: activeFile.name,
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
        if (parsed.code) {
          setFiles([
            {
              id: 'file-shared',
              name: parsed.fileName || 'shared.ts',
              language: parsed.language || 'typescript',
              code: parsed.code,
            },
          ]);
          setActiveFileId('file-shared');
        }
      }
    } catch (e) {
      console.warn('Could not parse share hash:', e);
    }
  }, []);

  // Compute pagination
  const documentData = useMemo(() => {
    return paginateCode({
      code: activeFile.code,
      language: activeFile.language,
      paperSize,
      orientation,
      margins,
      fontSize,
      lineHeight,
      preserveBlocks,
      lineWrapping,
      fileName: activeFile.name,
      metadata: {
        title: activeFile.name,
        author: watermarkText,
      },
    });
  }, [
    activeFile.code,
    activeFile.language,
    activeFile.name,
    paperSize,
    orientation,
    margins,
    fontSize,
    lineHeight,
    preserveBlocks,
    lineWrapping,
    watermarkText,
  ]);

  // Export handlers
  const handleCopyClipboard = async () => {
    const canvasEl = canvasRef.current?.getCanvasElement();
    if (!canvasEl) throw new Error('Canvas element not available.');
    await copyImageToClipboard(canvasEl, 2);
  };

  const handleExportPng = async (scale: number) => {
    const canvasEl = canvasRef.current?.getCanvasElement();
    if (!canvasEl) throw new Error('Canvas element not available.');
    await exportElementAsImage(canvasEl, {
      pixelRatio: scale,
      fileName: activeFile.name.replace(/\.[^/.]+$/, ''),
      format: 'png',
    });
  };

  const handleExportSvg = async () => {
    const canvasEl = canvasRef.current?.getCanvasElement();
    if (!canvasEl) throw new Error('Canvas element not available.');
    await exportElementAsSvg(canvasEl, {
      fileName: activeFile.name.replace(/\.[^/.]+$/, ''),
    });
  };

  const handleExportPdf = async () => {
    const pageEls = canvasRef.current?.getPageElements();
    if (!pageEls || pageEls.length === 0) throw new Error('No pages available for PDF export.');
    await exportElementsAsPdf(pageEls, {
      paperSize,
      orientation,
      fileName: activeFile.name.replace(/\.[^/.]+$/, ''),
      metadata: {
        title: activeFile.name,
        author: watermarkText,
      },
    });
  };

  const handleExportZip = async (format: 'png' | 'svg') => {
    const pageEls = canvasRef.current?.getPageElements();
    if (!pageEls || pageEls.length === 0) throw new Error('No pages available for ZIP export.');
    await exportElementsAsZip(pageEls, {
      fileName: activeFile.name.replace(/\.[^/.]+$/, ''),
      format,
      pixelRatio: 2.5,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-white">
      {/* Top App Shell Navbar */}
      <Navbar
        mode={mode}
        onChangeMode={handleModeChange}
        files={files}
        activeFileId={activeFileId}
        onSelectFile={setActiveFileId}
        onAddFile={handleAddFile}
        onDeleteFile={handleDeleteFile}
        onShareUrl={handleShareUrl}
        onLoadPreset={() => {}}
        onSavePreset={() => {}}
        shareCopied={shareCopied}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 pt-20 pb-28 px-4 sm:px-8 max-w-7xl mx-auto w-full flex flex-col items-center gap-6">
        {/* Quick Toggleable Code Input Drawer */}
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowEditorDrawer((prev) => !prev)}
              className="flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showEditorDrawer ? 'Hide Source Code Drawer' : 'Edit Source Code & Upload'}</span>
              {showEditorDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <div className="text-xs text-white/40 font-mono">
              {documentData.totalPages} {documentData.totalPages === 1 ? 'Page' : 'Pages'} • {documentData.totalLines} Lines
            </div>
          </div>

          {showEditorDrawer && (
            <div className="mb-6 animate-in fade-in duration-200">
              <CodeEditorArea
                code={activeFile.code}
                language={activeFile.language}
                fileName={activeFile.name}
                onChangeCode={handleCodeChange}
                onChangeLanguage={handleLanguageChange}
                onChangeFileName={handleFileNameChange}
                onAutoDetect={handleAutoDetect}
              />
            </div>
          )}
        </div>

        {/* Live Code Composition & Document Canvas */}
        <div className="w-full flex justify-center">
          <SnippetCanvas
            ref={canvasRef}
            documentData={documentData}
            paperSize={paperSize}
            orientation={orientation}
            theme={theme}
            font={font}
            frame={frame}
            background={background}
            fontSize={fontSize}
            lineHeight={lineHeight}
            showLineNumbers={showLineNumbers}
            canvasPadding={canvasPadding}
            borderRadius={borderRadius}
            dropShadow={dropShadow}
            windowOpacity={windowOpacity}
            margins={margins}
            docTitle={activeFile.name}
            docAuthor={watermarkText}
            docRepo="github.com/meta/astryx"
            showWatermark={showWatermark}
            watermarkText={watermarkText}
            fileName={activeFile.name}
            language={activeFile.language}
            onFileNameChange={handleFileNameChange}
          />
        </div>
      </main>

      {/* Floating Control Dock (Ray.so + Carbon + Astryx) */}
      <FloatingDock
        currentThemeId={themeId}
        currentFontId={fontId}
        fontSize={fontSize}
        lineHeight={lineHeight}
        currentFrameId={frameId}
        currentPaperId={paperSizeId}
        orientation={orientation}
        preserveBlocks={preserveBlocks}
        currentBgId={backgroundId}
        canvasPadding={canvasPadding}
        borderRadius={borderRadius}
        windowOpacity={windowOpacity}
        showLineNumbers={showLineNumbers}
        lineWrapping={lineWrapping}
        showWatermark={showWatermark}
        watermarkText={watermarkText}
        pageCount={documentData.totalPages}
        isPaginated={documentData.totalPages > 1 || paperSizeId !== 'auto'}
        onSelectTheme={setThemeId}
        onSelectFont={setFontId}
        onChangeFontSize={setFontSize}
        onChangeLineHeight={setLineHeight}
        onSelectFrame={setFrameId}
        onSelectPaper={setPaperSizeId}
        onSelectOrientation={setOrientation}
        onTogglePreserveBlocks={setPreserveBlocks}
        onSelectBackground={setBackgroundId}
        onChangePadding={setCanvasPadding}
        onChangeBorderRadius={setBorderRadius}
        onChangeOpacity={setWindowOpacity}
        onToggleLineNumbers={() => setShowLineNumbers((p) => !p)}
        onToggleLineWrapping={() => setLineWrapping((p) => !p)}
        onToggleWatermark={() => setShowWatermark((p) => !p)}
        onChangeWatermarkText={setWatermarkText}
        onCopyClipboard={handleCopyClipboard}
        onExportPng={handleExportPng}
        onExportSvg={handleExportSvg}
        onExportPdf={handleExportPdf}
        onExportZip={handleExportZip}
      />
    </div>
  );
}
