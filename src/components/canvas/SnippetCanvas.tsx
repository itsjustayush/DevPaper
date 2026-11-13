'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import {
  PaginatedDocument,
  PaperPreset,
  ThemeDefinition,
  FontDefinition,
  FrameDefinition,
  BackgroundPreset,
  PageOrientation,
  PaginatorMargins,
} from '@/types';
import { PageSheet } from './PageSheet';
import { WindowHeader } from './WindowHeader';
import { InlineCodeEditor } from './InlineCodeEditor';
import { Grid, List, Sparkles } from 'lucide-react';

export interface SnippetCanvasHandle {
  getCanvasElement: () => HTMLDivElement | null;
  getPageElements: () => HTMLElement[];
}

interface SnippetCanvasProps {
  documentData: PaginatedDocument;
  code: string;
  onCodeChange: (code: string) => void;
  language: string;
  isAutoDetected?: boolean;
  onLanguageChange?: (language: string, isAuto?: boolean) => void;
  fileName: string;
  onFileNameChange?: (name: string) => void;
  highlightedLines?: number[];
  onToggleLineHighlight?: (lineNumber: number) => void;
  paperSize: PaperPreset;
  orientation: PageOrientation;
  theme: ThemeDefinition;
  font: FontDefinition;
  frame: FrameDefinition;
  background: BackgroundPreset;
  fontSize: number;
  lineHeight: number;
  showLineNumbers: boolean;
  lineWrapping: boolean;
  canvasPadding: number;
  borderRadius: number;
  dropShadow: string;
  windowOpacity: number;
  margins: PaginatorMargins;
  docTitle?: string;
  docAuthor?: string;
  docRepo?: string;
  showWatermark?: boolean;
  watermarkText?: string;
}

export const SnippetCanvas = forwardRef<SnippetCanvasHandle, SnippetCanvasProps>(
  (
    {
      documentData,
      code,
      onCodeChange,
      language,
      isAutoDetected = true,
      onLanguageChange,
      fileName,
      onFileNameChange,
      highlightedLines = [],
      onToggleLineHighlight,
      paperSize,
      orientation,
      theme,
      font,
      frame,
      background,
      fontSize,
      lineHeight,
      showLineNumbers,
      lineWrapping,
      canvasPadding,
      borderRadius,
      dropShadow,
      windowOpacity,
      margins,
      docTitle,
      docAuthor,
      docRepo,
      showWatermark = true,
      watermarkText = 'DevPaper Typesetting Studio',
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const singleWindowRef = useRef<HTMLDivElement>(null);
    const [viewLayout, setViewLayout] = React.useState<'stream' | 'grid'>('stream');

    useImperativeHandle(ref, () => ({
      getCanvasElement: () => canvasRef.current,
      getPageElements: () => {
        const elements: HTMLElement[] = [];
        if (canvasRef.current) {
          const sheets = canvasRef.current.querySelectorAll<HTMLElement>('.devpaper-sheet');
          if (sheets.length > 0) {
            sheets.forEach((el) => elements.push(el));
          } else if (singleWindowRef.current) {
            elements.push(singleWindowRef.current);
          } else {
            elements.push(canvasRef.current);
          }
        }
        return elements;
      },
    }));

    const isAuto = paperSize.id === 'auto';
    const isMultiPage = documentData.totalPages > 1 && !isAuto;

    const windowStyle: React.CSSProperties = {
      backgroundColor: theme.background,
      borderRadius: `${borderRadius}px`,
      boxShadow: dropShadow,
      opacity: windowOpacity,
      borderColor: theme.border || 'rgba(255,255,255,0.1)',
    };

    return (
      <div className="flex flex-col items-center w-full gap-4">
        {/* Multi-Page Document View Layout Toggle (Stream vs Grid) */}
        {isMultiPage && (
          <div className="flex items-center justify-between w-full max-w-4xl px-4 py-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-xl text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-100">Document Flow:</span>
              <span className="font-mono text-emerald-400">
                {documentData.totalPages} {documentData.totalPages === 1 ? 'Page' : 'Pages'}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">{documentData.totalLines} Total Lines</span>
            </div>

            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setViewLayout('stream')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                  viewLayout === 'stream'
                    ? 'bg-zinc-800 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Stream</span>
              </button>
              <button
                onClick={() => setViewLayout('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                  viewLayout === 'grid'
                    ? 'bg-zinc-800 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>
          </div>
        )}

        {/* Master Canvas Wrapper (Captured for single-page PNG/SVG exports) */}
        <div
          ref={canvasRef}
          className="devpaper-canvas-root relative transition-all duration-300 rounded-3xl flex flex-col items-center justify-center max-w-full overflow-x-auto shadow-2xl"
          style={{
            background: background.value,
            padding: `${canvasPadding}px`,
          }}
        >
          {isAuto ? (
            /* Content-Aware Single Card Window with Direct In-Window Editing */
            <div
              ref={singleWindowRef}
              className="devpaper-sheet relative flex flex-col overflow-hidden border transition-all min-w-[360px] sm:min-w-[560px] max-w-[1200px] w-fit"
              style={windowStyle}
            >
              {/* Window Chrome Header with direct editable title & language */}
              <WindowHeader
                frame={frame}
                fileName={fileName}
                language={language}
                isAutoDetected={isAutoDetected}
                onFileNameChange={onFileNameChange}
                onLanguageChange={onLanguageChange}
                isEditable={true}
              />

              {/* Direct Interactive Code Editor Layer */}
              <div className="flex-1 w-full overflow-hidden">
                <InlineCodeEditor
                  code={code}
                  language={language}
                  theme={theme}
                  font={font}
                  fontSize={fontSize}
                  lineHeight={lineHeight}
                  showLineNumbers={showLineNumbers}
                  lineWrapping={lineWrapping}
                  highlightedLines={highlightedLines}
                  onCodeChange={onCodeChange}
                  onLanguageChange={(newLang) => onLanguageChange?.(newLang, true)}
                  onToggleLineHighlight={onToggleLineHighlight}
                />
              </div>

              {/* Optional Subtle Window Footer / Watermark */}
              {showWatermark && (
                <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 text-[10px] text-white/30 font-mono select-none">
                  <span>{fileName}</span>
                  <span>{watermarkText}</span>
                </div>
              )}
            </div>
          ) : (
            /* Paginated Multi-Page Document Sheets */
            <div
              className={`transition-all ${
                viewLayout === 'grid' && isMultiPage
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                  : 'flex flex-col items-center gap-8'
              }`}
            >
              {documentData.pages.map((page, idx) => (
                <PageSheet
                  key={`page-${page.pageNumber}-${idx}`}
                  page={page}
                  paperSize={paperSize}
                  orientation={orientation}
                  theme={theme}
                  font={font}
                  frame={frame}
                  fontSize={fontSize}
                  lineHeight={lineHeight}
                  showLineNumbers={showLineNumbers}
                  margins={margins}
                  docTitle={docTitle}
                  docAuthor={docAuthor}
                  docRepo={docRepo}
                  showWatermark={showWatermark}
                  watermarkText={watermarkText}
                  fileName={fileName}
                  language={language}
                  borderRadius={borderRadius}
                  dropShadow={dropShadow}
                  windowOpacity={windowOpacity}
                  onFileNameChange={onFileNameChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SnippetCanvas.displayName = 'SnippetCanvas';
