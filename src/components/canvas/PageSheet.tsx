'use client';

import React from 'react';
import {
  PaginatedPage,
  PaperPreset,
  ThemeDefinition,
  FontDefinition,
  FrameDefinition,
  PageOrientation,
  PaginatorMargins,
} from '@/types';
import { WindowHeader } from './WindowHeader';
import { CodeLineRenderer } from './CodeLineRenderer';
import { FileCode, GitFork, BookOpen } from 'lucide-react';

interface PageSheetProps {
  page: PaginatedPage;
  paperSize: PaperPreset;
  orientation: PageOrientation;
  theme: ThemeDefinition;
  font: FontDefinition;
  frame: FrameDefinition;
  fontSize: number;
  lineHeight: number;
  showLineNumbers: boolean;
  margins: PaginatorMargins;
  docTitle?: string;
  docAuthor?: string;
  docRepo?: string;
  showWatermark?: boolean;
  watermarkText?: string;
  fileName: string;
  language: string;
  borderRadius?: number;
  dropShadow?: string;
  windowOpacity?: number;
  onFileNameChange?: (name: string) => void;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}

export const PageSheet: React.FC<PageSheetProps> = ({
  page,
  paperSize,
  orientation,
  theme,
  font,
  frame,
  fontSize,
  lineHeight,
  showLineNumbers,
  margins,
  docTitle,
  docAuthor,
  docRepo,
  showWatermark = true,
  watermarkText = 'DevPaper Typesetting Studio',
  fileName,
  language,
  borderRadius = 12,
  dropShadow = '0 20px 40px rgba(0,0,0,0.4)',
  windowOpacity = 1,
  onFileNameChange,
  innerRef,
}) => {
  const isAuto = paperSize.id === 'auto';

  // Compute page style dimensions
  const pageStyle: React.CSSProperties = isAuto
    ? {
        minWidth: '580px',
        maxWidth: '1200px',
        width: 'fit-content',
      }
    : {
        width: orientation === 'landscape' ? `${paperSize.heightPx}px` : `${paperSize.widthPx}px`,
        minHeight: orientation === 'landscape' ? `${paperSize.widthPx}px` : `${paperSize.heightPx}px`,
        maxHeight: orientation === 'landscape' ? `${paperSize.widthPx}px` : `${paperSize.heightPx}px`,
        overflow: 'hidden',
        padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`,
      };

  const windowStyle: React.CSSProperties = {
    backgroundColor: theme.background,
    borderRadius: `${borderRadius}px`,
    boxShadow: dropShadow,
    opacity: windowOpacity,
    borderColor: theme.border || 'rgba(255,255,255,0.1)',
  };

  const maxDigits = page.lines.length > 0 ? String(page.endLineIndex).length : 3;

  return (
    <div
      ref={innerRef}
      className={`devpaper-sheet relative flex flex-col justify-between transition-all duration-200 select-text ${
        !isAuto ? 'bg-zinc-950/80 border border-white/10 shadow-2xl rounded-lg' : ''
      }`}
      style={pageStyle}
    >
      {/* Running Header for Multi-Page Documents */}
      {!isAuto && (
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-xs text-white/50 font-mono select-none">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white/80">{docTitle || fileName}</span>
            {docRepo && (
              <span className="flex items-center gap-1 text-white/40">
                <GitFork className="w-3 h-3" />
                <span>{docRepo}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-white/50 border border-white/10">
              {language}
            </span>
            <span>
              Page {page.pageNumber} of {page.totalPages}
            </span>
          </div>
        </div>
      )}

      {/* Main Code Window Container */}
      <div
        className="flex-1 flex flex-col overflow-hidden border transition-all"
        style={windowStyle}
      >
        {/* Window Chrome / Title Bar */}
        <WindowHeader
          frame={frame}
          fileName={fileName}
          language={language}
          onFileNameChange={onFileNameChange}
          isEditable={isAuto}
        />

        {/* Code Content Stream */}
        <div className="flex-1 py-3 overflow-hidden font-mono">
          {page.lines.map((line, idx) => (
            <CodeLineRenderer
              key={`${line.lineNumber}-${idx}`}
              line={line}
              language={language}
              theme={theme}
              font={font}
              fontSize={fontSize}
              lineHeight={lineHeight}
              showLineNumbers={showLineNumbers}
              maxLineNumberDigits={maxDigits}
            />
          ))}
        </div>
      </div>

      {/* Running Footer for Multi-Page Documents & Watermark */}
      <div className="flex items-center justify-between pt-3 mt-2 text-[11px] text-white/40 font-mono select-none">
        <div>
          {docAuthor ? (
            <span>Author: {docAuthor}</span>
          ) : (
            <span className="text-white/30">Lines {page.startLineIndex}–{page.endLineIndex}</span>
          )}
        </div>

        {showWatermark && (
          <div className="flex items-center gap-1 text-white/40 hover:text-white/60 transition">
            <BookOpen className="w-3 h-3 text-emerald-400/70" />
            <span>{watermarkText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

