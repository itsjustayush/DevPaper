'use client';

import React, { useState } from 'react';
import {
  Palette,
  Type,
  LayoutTemplate,
  FileSpreadsheet,
  PaintBucket,
  Settings2,
  Download,
  Check,
  Copy,
} from 'lucide-react';
import { DockPopover } from './DockPopover';
import { ThemeSelector } from './ThemeSelector';
import { FontSelector } from './FontSelector';
import { FrameSelector } from './FrameSelector';
import { PaperSelector } from './PaperSelector';
import { BackgroundSelector } from './BackgroundSelector';
import { ExportMenu } from './ExportMenu';
import { PageOrientation } from '@/types';

interface FloatingDockProps {
  currentThemeId: string;
  currentFontId: string;
  fontSize: number;
  lineHeight: number;
  currentFrameId: string;
  currentPaperId: string;
  orientation: PageOrientation;
  preserveBlocks: boolean;
  currentBgId: string;
  canvasPadding: number;
  borderRadius: number;
  windowOpacity: number;
  showLineNumbers: boolean;
  lineWrapping: boolean;
  showWatermark: boolean;
  watermarkText: string;
  pageCount: number;
  isPaginated: boolean;
  onSelectTheme: (id: string) => void;
  onSelectFont: (id: string) => void;
  onChangeFontSize: (size: number) => void;
  onChangeLineHeight: (height: number) => void;
  onSelectFrame: (id: string) => void;
  onSelectPaper: (id: string) => void;
  onSelectOrientation: (o: PageOrientation) => void;
  onTogglePreserveBlocks: (p: boolean) => void;
  onSelectBackground: (id: string) => void;
  onChangePadding: (pad: number) => void;
  onChangeBorderRadius: (rad: number) => void;
  onChangeOpacity: (op: number) => void;
  onToggleLineNumbers: () => void;
  onToggleLineWrapping: () => void;
  onToggleWatermark: () => void;
  onChangeWatermarkText: (text: string) => void;
  onCopyClipboard: () => Promise<void>;
  onExportPng: (scale: number) => Promise<void>;
  onExportSvg: () => Promise<void>;
  onExportPdf: () => Promise<void>;
  onExportZip: (format: 'png' | 'svg') => Promise<void>;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  currentThemeId,
  currentFontId,
  fontSize,
  lineHeight,
  currentFrameId,
  currentPaperId,
  orientation,
  preserveBlocks,
  currentBgId,
  canvasPadding,
  borderRadius,
  windowOpacity,
  showLineNumbers,
  lineWrapping,
  showWatermark,
  watermarkText,
  pageCount,
  isPaginated,
  onSelectTheme,
  onSelectFont,
  onChangeFontSize,
  onChangeLineHeight,
  onSelectFrame,
  onSelectPaper,
  onSelectOrientation,
  onTogglePreserveBlocks,
  onSelectBackground,
  onChangePadding,
  onChangeBorderRadius,
  onChangeOpacity,
  onToggleLineNumbers,
  onToggleLineWrapping,
  onToggleWatermark,
  onChangeWatermarkText,
  onCopyClipboard,
  onExportPng,
  onExportSvg,
  onExportPdf,
  onExportZip,
}) => {
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [quickCopied, setQuickCopied] = useState(false);

  const togglePopover = (name: string) => {
    setActivePopover((prev) => (prev === name ? null : name));
  };

  const handleQuickCopy = async () => {
    try {
      await onCopyClipboard();
      setQuickCopied(true);
      setTimeout(() => setQuickCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="relative flex items-center gap-1.5 p-1.5 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
        {/* Theme Button */}
        <div className="relative">
          <button
            onClick={() => togglePopover('theme')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
              activePopover === 'theme'
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title="Themes"
          >
            <Palette className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Theme</span>
          </button>
          <DockPopover
            isOpen={activePopover === 'theme'}
            onClose={() => setActivePopover(null)}
            title="Syntax & Editor Themes"
            width="w-80"
          >
            <ThemeSelector currentThemeId={currentThemeId} onSelectTheme={onSelectTheme} />
          </DockPopover>
        </div>

        {/* Font Button */}
        <div className="relative">
          <button
            onClick={() => togglePopover('font')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
              activePopover === 'font'
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title="Typography"
          >
            <Type className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Font</span>
          </button>
          <DockPopover
            isOpen={activePopover === 'font'}
            onClose={() => setActivePopover(null)}
            title="Typography & Ligatures"
            width="w-80"
          >
            <FontSelector
              currentFontId={currentFontId}
              fontSize={fontSize}
              lineHeight={lineHeight}
              onSelectFont={onSelectFont}
              onChangeFontSize={onChangeFontSize}
              onChangeLineHeight={onChangeLineHeight}
            />
          </DockPopover>
        </div>

        {/* Window Frame Button */}
        <div className="relative">
          <button
            onClick={() => togglePopover('frame')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
              activePopover === 'frame'
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title="Window Chrome"
          >
            <LayoutTemplate className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Frame</span>
          </button>
          <DockPopover
            isOpen={activePopover === 'frame'}
            onClose={() => setActivePopover(null)}
            title="Window Controls & Header"
            width="w-80"
          >
            <FrameSelector currentFrameId={currentFrameId} onSelectFrame={onSelectFrame} />
          </DockPopover>
        </div>

        {/* Paper Size / Format Button */}
        <div className="relative">
          <button
            onClick={() => togglePopover('paper')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
              activePopover === 'paper'
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title="Paper Size & Pagination"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Paper</span>
          </button>
          <DockPopover
            isOpen={activePopover === 'paper'}
            onClose={() => setActivePopover(null)}
            title="Paper Presets & Pagination Flow"
            width="w-96"
          >
            <PaperSelector
              currentPaperId={currentPaperId}
              orientation={orientation}
              preserveBlocks={preserveBlocks}
              onSelectPaper={onSelectPaper}
              onSelectOrientation={onSelectOrientation}
              onTogglePreserveBlocks={onTogglePreserveBlocks}
            />
          </DockPopover>
        </div>

        {/* Canvas & Background Button */}
        <div className="relative">
          <button
            onClick={() => togglePopover('background')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
              activePopover === 'background'
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title="Canvas Wallpaper & Padding"
          >
            <PaintBucket className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Canvas</span>
          </button>
          <DockPopover
            isOpen={activePopover === 'background'}
            onClose={() => setActivePopover(null)}
            title="Canvas Wallpaper & Padding"
            width="w-80"
          >
            <BackgroundSelector
              currentBgId={currentBgId}
              canvasPadding={canvasPadding}
              borderRadius={borderRadius}
              windowOpacity={windowOpacity}
              onSelectBackground={onSelectBackground}
              onChangePadding={onChangePadding}
              onChangeBorderRadius={onChangeBorderRadius}
              onChangeOpacity={onChangeOpacity}
            />
          </DockPopover>
        </div>

        {/* Settings Button */}
        <div className="relative">
          <button
            onClick={() => togglePopover('settings')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
              activePopover === 'settings'
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title="Options & Watermark"
          >
            <Settings2 className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Options</span>
          </button>
          <DockPopover
            isOpen={activePopover === 'settings'}
            onClose={() => setActivePopover(null)}
            title="Display Options & Watermark"
            width="w-80"
          >
            <div className="space-y-3">
              {/* Line Numbers Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-white/[0.02]">
                <span className="text-xs text-white">Line Numbers</span>
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={onToggleLineNumbers}
                  className="w-4 h-4 accent-emerald-400 cursor-pointer rounded"
                />
              </div>

              {/* Line Wrapping Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-white/[0.02]">
                <span className="text-xs text-white">Line Wrapping</span>
                <input
                  type="checkbox"
                  checked={lineWrapping}
                  onChange={onToggleLineWrapping}
                  className="w-4 h-4 accent-emerald-400 cursor-pointer rounded"
                />
              </div>

              {/* Watermark Toggle & Text */}
              <div className="space-y-2 p-2 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Watermark / Author</span>
                  <input
                    type="checkbox"
                    checked={showWatermark}
                    onChange={onToggleWatermark}
                    className="w-4 h-4 accent-emerald-400 cursor-pointer rounded"
                  />
                </div>
                {showWatermark && (
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => onChangeWatermarkText(e.target.value)}
                    placeholder="Author / Organization handle"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-emerald-400 transition"
                  />
                )}
              </div>
            </div>
          </DockPopover>
        </div>

        <div className="w-[1px] h-6 bg-white/10 mx-1" />

        {/* Quick Copy Button */}
        <button
          onClick={handleQuickCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition"
          title="Quick Copy to Clipboard"
        >
          {quickCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span className="hidden md:inline">{quickCopied ? 'Copied!' : 'Copy'}</span>
        </button>

        {/* Export Button */}
        <div className="relative">
          <button
            onClick={() => togglePopover('export')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <DockPopover
            isOpen={activePopover === 'export'}
            onClose={() => setActivePopover(null)}
            title="Export Studio"
            width="w-96"
          >
            <ExportMenu
              onCopyClipboard={onCopyClipboard}
              onExportPng={onExportPng}
              onExportSvg={onExportSvg}
              onExportPdf={onExportPdf}
              onExportZip={onExportZip}
              isPaginated={isPaginated}
              pageCount={pageCount}
            />
          </DockPopover>
        </div>
      </div>
    </div>
  );
};

