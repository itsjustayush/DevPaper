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
        <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
          Canvas Wallpaper
        </label>
        <div className="grid grid-cols-3 gap-2">
          {backgrounds.map((bg) => {
            const isSelected = bg.id === currentBgId;
            return (
              <button
                key={bg.id}
                onClick={() => onSelectBackground(bg.id)}
                className={`group relative h-14 rounded-xl border flex items-end p-1.5 text-left overflow-hidden transition ${
                  isSelected ? 'border-emerald-400 ring-2 ring-emerald-400/30' : 'border-white/10 hover:border-white/30'
                }`}
                style={{ background: bg.value }}
                title={bg.name}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
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
        <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
          Outer Canvas Padding
        </label>
        <div className="grid grid-cols-4 gap-2">
          {paddingPresets.map((pad) => (
            <button
              key={pad}
              onClick={() => onChangePadding(pad)}
              className={`p-2 rounded-xl text-xs font-mono border transition ${
                canvasPadding === pad
                  ? 'border-emerald-400 bg-white/10 text-white font-medium'
                  : 'border-white/5 bg-white/[0.03] text-white/60 hover:text-white'
              }`}
            >
              {pad}px
            </button>
          ))}
        </div>
      </div>

      {/* Window Border Radius Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-white/70">
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
          className="w-full accent-emerald-400 cursor-pointer"
        />
      </div>

      {/* Window Opacity Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Window Opacity</span>
          <span className="font-mono text-emerald-400">{Math.round(windowOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.4"
          max="1.0"
          step="0.05"
          value={windowOpacity}
          onChange={(e) => onChangeOpacity(Number(e.target.value))}
          className="w-full accent-emerald-400 cursor-pointer"
        />
      </div>
    </div>
  );
};
