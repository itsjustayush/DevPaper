'use client';

import React from 'react';
import { listBackgrounds } from '@/registries/backgrounds';
import { Check } from 'lucide-react';

interface BackgroundSelectorProps {
  currentBgId: string;
  canvasPadding: number;
  borderRadius: number;
  windowOpacity: number;
  onSelectBackground: (bgId: string) => void;
  onChangePadding: (padding: number) => void;
  onChangeBorderRadius: (radius: number) => void;
  onChangeOpacity: (opacity: number) => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBgId,
  canvasPadding,
  borderRadius,
  windowOpacity,
  onSelectBackground,
  onChangePadding,
  onChangeBorderRadius,
  onChangeOpacity,
}) => {
  const backgrounds = listBackgrounds();
  const paddingPresets = [16, 32, 64, 128];

  return (
    <div className="space-y-4">
      {/* Background Gradients & Solids */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
          Canvas Wallpaper
        </label>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
          {backgrounds.map((bg) => {
            const isSelected = bg.id === currentBgId;
            return (
              <button
                key={bg.id}
                onClick={() => onSelectBackground(bg.id)}
                className={`group relative h-14 rounded-xl border flex items-end p-1.5 text-left overflow-hidden transition ${
                  isSelected ? 'border-emerald-400 ring-2 ring-emerald-400/30' : 'border-zinc-800 hover:border-zinc-600'
                }`}
                style={{ background: bg.value }}
                title={bg.name}
              >
                <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition" />
                <span className="relative z-10 text-[10px] font-medium text-white drop-shadow truncate">
                  {bg.name}
                </span>
                {isSelected && (
                  <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-white bg-emerald-500 rounded-full p-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Padding Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
          Outer Canvas Padding
        </label>
        <div className="grid grid-cols-4 gap-2">
          {paddingPresets.map((pad) => (
            <button
              key={pad}
              onClick={() => onChangePadding(pad)}
              className={`p-2 rounded-xl text-xs font-mono border transition ${
                canvasPadding === pad
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-zinc-100 font-medium'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              {pad}px
            </button>
          ))}
        </div>
      </div>

      {/* Window Border Radius Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-300">
          <span>Corner Radius</span>
          <span className="font-mono text-emerald-400">{borderRadius}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="32"
          step="2"
          value={borderRadius}
          onChange={(e) => onChangeBorderRadius(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
      </div>

      {/* Window Opacity Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-300">
          <span>Window Transparency</span>
          <span className="font-mono text-emerald-400">{Math.round(windowOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.2"
          max="1"
          step="0.05"
          value={windowOpacity}
          onChange={(e) => onChangeOpacity(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
