'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Download,
  FileText,
  Archive,
  Image as ImageIcon,
  Check,
  Loader2,
  Sparkles,
  Maximize2,
  Printer,
  Sliders,
  Monitor,
  Share2,
} from 'lucide-react';
import { PaperPreset, PageOrientation, PaginatorMargins } from '@/types';
import { PAPER_REGISTRY } from '@/registries/paperSizes';

interface ExportStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  code: string;
  pageCount: number;
  totalLines: number;
  currentPaperId: string;
  orientation: PageOrientation;
  preserveBlocks: boolean;
  onSelectPaper: (id: string) => void;
  onSelectOrientation: (o: PageOrientation) => void;
  onTogglePreserveBlocks: (p: boolean) => void;
  onCopyClipboard: () => Promise<void>;
  onExportPng: (scale: number) => Promise<void>;
  onExportSvg: () => Promise<void>;
  onExportPdf: () => Promise<void>;
  onExportZip: (format: 'png' | 'svg') => Promise<void>;
}

export const ExportStudioModal: React.FC<ExportStudioModalProps> = ({
  isOpen,
  onClose,
  fileName,
  code,
  pageCount,
  totalLines,
  currentPaperId,
  orientation,
  preserveBlocks,
  onSelectPaper,
  onSelectOrientation,
  onTogglePreserveBlocks,
  onCopyClipboard,
  onExportPng,
  onExportSvg,
  onExportPdf,
  onExportZip,
}) => {
  const [resolution, setResolution] = useState<number>(2); // 1x, 2x, 3x
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'print' | 'presentation' | 'social'>('all');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentPreset = PAPER_REGISTRY[currentPaperId] || PAPER_REGISTRY['auto'];
  const isAuto = currentPreset.id === 'auto';
  const isMultiPage = pageCount > 1 && !isAuto;

  const handleCopy = async () => {
    try {
      setLoadingAction('copy');
      await onCopyClipboard();
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExecute = async (actionKey: string, fn: () => Promise<void>) => {
    try {
      setLoadingAction(actionKey);
      await fn();
    } catch (err) {
      console.error(`Export failed for ${actionKey}:`, err);
    } finally {
      setLoadingAction(null);
    }
  };

  const paperPresetsList = Object.values(PAPER_REGISTRY).filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory || p.category === 'auto';
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100">
              <Download className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 tracking-tight">Export & Sizing Studio</h2>
              <p className="text-xs text-zinc-400">
                Choose format, paper dimensions, and rendering resolution
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 custom-scrollbar text-zinc-200">
          {/* Quick Copy to Clipboard Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-100">
                  {copied ? 'Copied to Clipboard!' : 'Copy Image to Clipboard'}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Instant 2x retina PNG ready to paste into Slack, Discord, Twitter, or docs
                </div>
              </div>
            </div>

            <button
              onClick={handleCopy}
              disabled={loadingAction !== null}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold transition shrink-0 cursor-pointer disabled:opacity-50"
            >
              {loadingAction === 'copy' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : copied ? (
                'Copied'
              ) : (
                'Copy PNG'
              )}
            </button>
          </div>

          {/* Section 1: Paper & Canvas Sizing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Canvas & Paper Sizing</span>
              </label>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
                {(['all', 'print', 'presentation', 'social'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-0.5 rounded capitalize transition ${
                      activeCategory === cat
                        ? 'bg-zinc-800 text-zinc-100 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
              {paperPresetsList.map((preset) => {
                const isSelected = preset.id === currentPaperId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPaper(preset.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-zinc-100'
                        : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg mt-0.5 ${
                        isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {preset.category === 'auto' && <Sparkles className="w-3.5 h-3.5" />}
                      {preset.category === 'print' && <Printer className="w-3.5 h-3.5" />}
                      {preset.category === 'presentation' && <Monitor className="w-3.5 h-3.5" />}
                      {preset.category === 'social' && <Share2 className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium truncate">{preset.name}</span>
                        {preset.aspectRatio && (
                          <span className="text-[10px] font-mono text-zinc-500">{preset.aspectRatio}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {preset.description || `${preset.widthPx} × ${preset.heightPx} px`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Orientation & Smart Pagination (for physical paper) */}
            {!isAuto && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs">
                {/* Orientation Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Orientation:</span>
                  <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                    <button
                      onClick={() => onSelectOrientation('portrait')}
                      className={`px-2.5 py-1 rounded transition ${
                        orientation === 'portrait'
                          ? 'bg-zinc-800 text-zinc-100 font-medium'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      onClick={() => onSelectOrientation('landscape')}
                      className={`px-2.5 py-1 rounded transition ${
                        orientation === 'landscape'
                          ? 'bg-zinc-800 text-zinc-100 font-medium'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>

                {/* Keep logical blocks together */}
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={preserveBlocks}
                    onChange={(e) => onTogglePreserveBlocks(e.target.checked)}
                    className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                  />
                  <span>Avoid breaking code blocks</span>
                </label>
              </div>
            )}
          </div>

          {/* Section 2: Resolution / Scale */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span>Rendering Resolution</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { scale: 1, label: '1x Web', desc: 'Standard 96 DPI' },
                { scale: 2, label: '2x Retina', desc: 'Crisp @2x (Recommended)' },
                { scale: 3, label: '3x Print', desc: 'Ultra 300 DPI high-res' },
              ].map((res) => (
                <button
                  key={res.scale}
                  onClick={() => setResolution(res.scale)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    resolution === res.scale
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-zinc-100'
                      : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900 text-zinc-400'
                  }`}
                >
                  <div className="text-xs font-medium text-zinc-200">{res.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{res.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Document Status & Summary */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/80 text-xs text-zinc-400 font-mono">
            <div>
              Target: <span className="text-zinc-200">{currentPreset.name}</span>
            </div>
            <div>
              {isAuto ? (
                <span className="text-emerald-400">Snug Single Card • {totalLines} Lines</span>
              ) : (
                <span className="text-emerald-400">
                  {pageCount} {pageCount === 1 ? 'Page' : 'Pages'} • {totalLines} Lines
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Export Action Buttons */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            Exporting <span className="font-mono text-zinc-200">{fileName}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download PNG */}
            <button
              onClick={() => handleExecute('png', () => onExportPng(resolution))}
              disabled={loadingAction !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium border border-zinc-700 transition cursor-pointer disabled:opacity-50"
            >
              {loadingAction === 'png' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span>PNG ({resolution}x)</span>
            </button>

            {/* Download SVG */}
            <button
              onClick={() => handleExecute('svg', () => onExportSvg())}
              disabled={loadingAction !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium border border-zinc-700 transition cursor-pointer disabled:opacity-50"
            >
              {loadingAction === 'svg' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <Download className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span>SVG</span>
            </button>

            {/* Download Multi-Page PDF */}
            <button
              onClick={() => handleExecute('pdf', () => onExportPdf())}
              disabled={loadingAction !== null}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold shadow-lg shadow-emerald-500/10 transition cursor-pointer disabled:opacity-50"
              title="Print-ready true paper vector PDF"
            >
              {loadingAction === 'pdf' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-zinc-950" />
              )}
              <span>Download PDF</span>
            </button>

            {/* Download ZIP Archive (for multi-page) */}
            {isMultiPage && (
              <button
                onClick={() => handleExecute('zip', () => onExportZip('png'))}
                disabled={loadingAction !== null}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium border border-zinc-700 transition cursor-pointer disabled:opacity-50"
                title="Bundle all pages into a ZIP archive"
              >
                {loadingAction === 'zip' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                ) : (
                  <Archive className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>ZIP Pages</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

