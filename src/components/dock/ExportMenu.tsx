'use client';

import React, { useState } from 'react';
import {
  Download,
  Copy,
  FileText,
  Archive,
  Image,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface ExportMenuProps {
  onCopyClipboard: () => Promise<void>;
  onExportPng: (scale: number) => Promise<void>;
  onExportSvg: () => Promise<void>;
  onExportPdf: () => Promise<void>;
  onExportZip: (format: 'png' | 'svg') => Promise<void>;
  isPaginated: boolean;
  pageCount: number;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  onCopyClipboard,
  onExportPng,
  onExportSvg,
  onExportPdf,
  onExportZip,
  isPaginated,
  pageCount,
}) => {
  const [copied, setCopied] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      setLoadingAction('copy');
      await onCopyClipboard();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExport = async (actionKey: string, fn: () => Promise<void>) => {
    try {
      setLoadingAction(actionKey);
      await fn();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Quick Copy to Clipboard */}
      <button
        onClick={handleCopy}
        disabled={loadingAction !== null}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-medium text-xs transition"
      >
        <div className="flex items-center gap-2">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Image to Clipboard!' : 'Copy Image to Clipboard'}</span>
        </div>
        <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">PNG 2x</span>
      </button>

      {/* Single Snippet Images */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
          Single-Frame Images
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleExport('png-1x', () => onExportPng(1))}
            disabled={loadingAction !== null}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] text-xs transition"
          >
            {loadingAction === 'png-1x' ? <Loader2 className="w-4 h-4 animate-spin text-white/60 mb-1" /> : <Image className="w-4 h-4 text-white/60 mb-1" />}
            <span className="font-medium text-white">PNG 1x</span>
            <span className="text-[9px] text-white/40">Web Standard</span>
          </button>

          <button
            onClick={() => handleExport('png-2x', () => onExportPng(2))}
            disabled={loadingAction !== null}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-xs transition"
          >
            {loadingAction === 'png-2x' ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400 mb-1" /> : <Sparkles className="w-4 h-4 text-emerald-400 mb-1" />}
            <span className="font-medium text-white">PNG 2x</span>
            <span className="text-[9px] text-emerald-400/80">Retina Crisp</span>
          </button>

          <button
            onClick={() => handleExport('svg', () => onExportSvg())}
            disabled={loadingAction !== null}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] text-xs transition"
          >
            {loadingAction === 'svg' ? <Loader2 className="w-4 h-4 animate-spin text-white/60 mb-1" /> : <Download className="w-4 h-4 text-white/60 mb-1" />}
            <span className="font-medium text-white">SVG</span>
            <span className="text-[9px] text-white/40">Lossless Vector</span>
          </button>
        </div>
      </div>

      {/* Multi-Page Document Exports (Active when Paginated or CodePaper mode) */}
      <div className="space-y-1 pt-1 border-t border-white/10">
        <div className="flex items-center justify-between text-[11px] font-medium text-white/50 uppercase tracking-wider">
          <span>Multi-Page Document</span>
          <span className="text-emerald-400/80 font-mono lowercase">{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
        </div>

        <div className="space-y-1.5">
          <button
            onClick={() => handleExport('pdf', () => onExportPdf())}
            disabled={loadingAction !== null}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs transition"
          >
            <div className="flex items-center gap-2.5">
              {loadingAction === 'pdf' ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <FileText className="w-4 h-4 text-red-400" />
              )}
              <div className="text-left">
                <div className="font-medium text-white">Merged Multi-Page PDF</div>
                <div className="text-[10px] text-white/40">Print-ready true paper vector/raster document</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-white/40" />
          </button>

          <button
            onClick={() => handleExport('zip-png', () => onExportZip('png'))}
            disabled={loadingAction !== null}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs transition"
          >
            <div className="flex items-center gap-2.5">
              {loadingAction === 'zip-png' ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <Archive className="w-4 h-4 text-amber-400" />
              )}
              <div className="text-left">
                <div className="font-medium text-white">Bundled ZIP (Numbered PNGs)</div>
                <div className="text-[10px] text-white/40">page-01.png, page-02.png, ... high-res archive</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>
    </div>
  );
};

