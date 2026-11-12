'use client';

import React from 'react';
import { listPaperSizes } from '@/registries/paperSizes';
import { PageOrientation, PaperCategory } from '@/types';
import { Check, Columns, Rows, ShieldCheck } from 'lucide-react';

interface PaperSelectorProps {
  currentPaperId: string;
  orientation: PageOrientation;
  preserveBlocks: boolean;
  onSelectPaper: (paperId: string) => void;
  onSelectOrientation: (orientation: PageOrientation) => void;
  onTogglePreserveBlocks: (preserve: boolean) => void;
}

export const PaperSelector: React.FC<PaperSelectorProps> = ({
  currentPaperId,
  orientation,
  preserveBlocks,
  onSelectPaper,
  onSelectOrientation,
  onTogglePreserveBlocks,
}) => {
  const categories: { label: string; key: PaperCategory }[] = [
    { label: 'Auto', key: 'auto' },
    { label: 'Print Standard', key: 'print' },
    { label: 'Presentation & Slides', key: 'presentation' },
    { label: 'Social & Hero', key: 'social' },
  ];

  return (
    <div className="space-y-4">
      {/* Orientation Controls (for non-auto) */}
      {currentPaperId !== 'auto' && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
            Page Orientation
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectOrientation('portrait')}
              className={`flex items-center justify-center gap-2 p-2 rounded-xl text-xs border transition ${
                orientation === 'portrait'
                  ? 'border-emerald-400 bg-white/10 text-white font-medium'
                  : 'border-white/5 bg-white/[0.03] text-white/60 hover:text-white'
              }`}
            >
              <Rows className="w-3.5 h-3.5 rotate-90" />
              <span>Portrait</span>
            </button>
            <button
              onClick={() => onSelectOrientation('landscape')}
              className={`flex items-center justify-center gap-2 p-2 rounded-xl text-xs border transition ${
                orientation === 'landscape'
                  ? 'border-emerald-400 bg-white/10 text-white font-medium'
                  : 'border-white/5 bg-white/[0.03] text-white/60 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Landscape</span>
            </button>
          </div>
        </div>
      )}

      {/* Block-Boundary Preservation Heuristic */}
      {currentPaperId !== 'auto' && (
        <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-xs font-medium text-white">Smart Page-Break</div>
              <div className="text-[10px] text-white/40">Avoid breaking inside functions</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={preserveBlocks}
            onChange={(e) => onTogglePreserveBlocks(e.target.checked)}
            className="w-4 h-4 accent-emerald-400 cursor-pointer rounded"
          />
        </div>
      )}

      {/* Categories & Presets */}
      {categories.map((cat) => {
        const presets = listPaperSizes(cat.key);
        if (presets.length === 0) return null;

        return (
          <div key={cat.key} className="space-y-1.5">
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
              {cat.label}
            </label>
            <div className="space-y-1">
              {presets.map((preset) => {
                const isSelected = preset.id === currentPaperId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPaper(preset.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left border transition text-xs ${
                      isSelected
                        ? 'border-emerald-400 bg-white/10 text-white font-medium'
                        : 'border-white/5 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white">{preset.name}</div>
                      {preset.description && (
                        <div className="text-[10px] text-white/40">{preset.description}</div>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

