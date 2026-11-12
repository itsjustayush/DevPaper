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
import { Grid, List } from 'lucide-react';

export interface SnippetCanvasHandle {
  getCanvasElement: () => HTMLDivElement | null;
  getPageElements: () => HTMLElement[];
}

interface SnippetCanvasProps {
  documentData: PaginatedDocument;
  paperSize: PaperPreset;
  orientation: PageOrientation;
  theme: ThemeDefinition;
  font: FontDefinition;
  frame: FrameDefinition;
  background: BackgroundPreset;
  fontSize: number;
  lineHeight: number;
  showLineNumbers: boolean;
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
  fileName: string;
  language: string;
  onFileNameChange?: (name: string) => void;
}

export const SnippetCanvas = forwardRef<SnippetCanvasHandle, SnippetCanvasProps>(
  (
    {
      documentData,
      paperSize,
      orientation,
      theme,
      font,
      frame,
      background,
      fontSize,
      lineHeight,
      showLineNumbers,
      canvasPadding,
      borderRadius,
      dropShadow,
      windowOpacity,
      margins,
      docTitle,
      docAuthor,
      docRepo,
      showWatermark,
      watermarkText,
      fileName,
      language,
      onFileNameChange,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [viewLayout, setViewLayout] = React.useState<'stream' | 'grid'>('stream');

    useImperativeHandle(ref, () => ({
      getCanvasElement: () => canvasRef.current,
      getPageElements: () => {
        // Collect all non-null page sheet elements
        const elements: HTMLElement[] = [];
        if (canvasRef.current) {
          const sheets = canvasRef.current.querySelectorAll<HTMLElement>('.devpaper-sheet');
          sheets.forEach((el) => elements.push(el));
        }
        return elements;
      },
    }));

    const isAuto = paperSize.id === 'auto';
    const isMultiPage = documentData.totalPages > 1;

    return (
      <div className="flex flex-col items-center w-full gap-4">
        {/* Multi-Page View Layout Toggle (Stream vs Grid) */}
        {isMultiPage && (
          <div className="flex items-center justify-between w-full max-w-4xl px-4 py-2 bg-zinc-950/60 backdrop-blur-md border border-white/10 rounded-xl text-xs text-white/70">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Document Preview:</span>
              <span className="font-mono text-emerald-400">
                {documentData.totalPages} {documentData.totalPages === 1 ? 'Page' : 'Pages'}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-white/50">{documentData.totalLines} Total Lines</span>
            </div>

            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setViewLayout('stream')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                  viewLayout === 'stream'
                    ? 'bg-emerald-500 text-zinc-950 font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Stream</span>
              </button>
              <button
                onClick={() => setViewLayout('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                  viewLayout === 'grid'
                    ? 'bg-emerald-500 text-zinc-950 font-semibold'
                    : 'text-white/60 hover:text-white'
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
          className="relative transition-all duration-300 rounded-3xl flex flex-col items-center justify-center max-w-full overflow-x-auto shadow-2xl"
          style={{
            background: background.value,
            padding: `${canvasPadding}px`,
          }}
        >
          {/* Paginated Sheets Container */}
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
        </div>
      </div>
    );
  }
);

SnippetCanvas.displayName = 'SnippetCanvas';
