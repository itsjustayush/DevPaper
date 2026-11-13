'use client';

import React, { useState } from 'react';
import {
  Palette,
  Type,
  LayoutTemplate,
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
import { BackgroundSelector } from './BackgroundSelector';

interface FloatingDockProps {
  currentThemeId: string;
  currentFontId: string;
  fontSize: number;
  lineHeight: number;
  currentFrameId: string;
  currentBgId: string;
  canvasPadding: number;
  borderRadius: number;
  windowOpacity: number;
  showLineNumbers: boolean;
  lineWrapping: boolean;
  showWatermark: boolean;
  watermarkText: string;
  onSelectTheme: (id: string) => void;
  onSelectFont: (id: string) => void;
  onChangeFontSize: (size: number) => void;
  onChangeLineHeight: (height: number) => void;
  onSelectFrame: (id: string) => void;
  onSelectBackground: (id: string) => void;
  onChangePadding: (pad: number) => void;
  onChangeBorderRadius: (rad: number) => void;
  onChangeOpacity: (op: number) => void;
  onToggleLineNumbers: () => void;
  onToggleLineWrapping: () => void;
  onToggleWatermark: () => void;
  onChangeWatermarkText: (text: string) => void;
  onCopyClipboard: () => Promise<void>;
  onOpenExportModal: () => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  currentThemeId,
  currentFontId,
  fontSize,
  lineHeight,
  currentFrameId,
  currentBgId,
  canvasPadding,
  borderRadius,
  windowOpacity,
  showLineNumbers,
  lineWrapping,
  showWatermark,
  watermarkText,
  onSelectTheme,
  onSelectFont,
  onChangeFontSize,
  onChangeLineHeight,
  onSelectFrame,
  onSelectBackground,
  onChangePadding,
  onChangeBorderRadius,
  onChangeOpacity,
  onToggleLineNumbers,
  onToggleLineWrapping,
  onToggleWatermark,
  onChangeWatermarkText,
  onCopyClipboard,
  onOpenExportModal,
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="relative flex items-center gap-1.5 p-1.5 bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 rounded-2xl shadow-2xl">
        {/* Theme Button */}
        <div className="relative">
          <button
            onClick={() => togglePopover('theme')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
              activePopover === 'theme'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
            title="Themes"
          >
            <Palette className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Theme</span>
          </button>
          <DockPopover
            isOpen={activePopover === 'theme'}
            onClose={() => setActivePopover(null)}
            title="Syntax Themes"
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
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
            title="Typography & Ligatures"
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
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
            title="Window Chrome"
          >
            <LayoutTemplate className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Frame</span>
          </button>
          <DockPopover
            isOpen={activePopover === 'frame'}
            onClose={() => setActivePopover(null)}
            title="Window Chrome & Controls"
            width="w-80"
          >
            <FrameSelector currentFrameId={currentFrameId} onSelectFrame={onSelectFrame} />
          </DockPopover>
        </div>

        {/* Canvas & Background Button */}
        <div className="relative">
          <button
            onClick={() => togglePopover('background')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
              activePopover === 'background'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
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

        {/* Options & Watermark Button */}
        <div className="relative">
          <button
            onClick={() => togglePopover('settings')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
              activePopover === 'settings'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
            title="Display Options & Watermark"
          >
            <Settings2 className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Options</span>
          </button>
          <DockPopover
            isOpen={activePopover === 'settings'}
            onClose={() => setActivePopover(null)}
            title="Display Options"
            width="w-80"
          >
            <div className="space-y-3">
              {/* Line Numbers Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <span className="text-xs text-zinc-200">Line Numbers</span>
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={onToggleLineNumbers}
                  className="w-4 h-4 accent-emerald-400 cursor-pointer rounded"
                />
              </div>

              {/* Line Wrapping Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <span className="text-xs text-zinc-200">Line Wrapping</span>
                <input
                  type="checkbox"
                  checked={lineWrapping}
                  onChange={onToggleLineWrapping}
                  className="w-4 h-4 accent-emerald-400 cursor-pointer rounded"
                />
              </div>

              {/* Watermark Toggle & Text */}
              <div className="space-y-2 p-2 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-200">Watermark / Footer</span>
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
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100 outline-none focus:border-emerald-400 transition"
                  />
                )}
              </div>
            </div>
          </DockPopover>
        </div>

        <div className="w-[1px] h-6 bg-zinc-800 mx-1" />

        {/* Quick Copy Button */}
        <button
          onClick={handleQuickCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 transition cursor-pointer"
          title="Quick Copy to Clipboard"
        >
          {quickCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
          <span className="hidden md:inline">{quickCopied ? 'Copied' : 'Copy'}</span>
        </button>

        {/* Export Button (Opens Export & Sizing Studio) */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/15 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};
