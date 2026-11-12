'use client';

import React from 'react';
import { listFonts } from '@/registries/fonts';
import { Check, Sparkles } from 'lucide-react';

interface FontSelectorProps {
  currentFontId: string;
  fontSize: number;
  lineHeight: number;
  onSelectFont: (fontId: string) => void;
  onChangeFontSize: (size: number) => void;
  onChangeLineHeight: (height: number) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  currentFontId,
  fontSize,
  lineHeight,
  onSelectFont,
  onChangeFontSize,
  onChangeLineHeight,
}) => {
  const fonts = listFonts();

  return (
    <div className="space-y-4">
      {/* Font Families */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
          Typeface
        </label>
        <div className="space-y-1">
          {fonts.map((font) => {
            const isSelected = font.id === currentFontId;
            return (
              <button
                key={font.id}
                onClick={() => onSelectFont(font.id)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left border transition text-xs ${
                  isSelected
                    ? 'border-emerald-400 bg-white/10 text-white font-medium'
                    : 'border-white/5 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white'
                }`}
                style={{ fontFamily: font.fontFamily }}
              >
                <div className="flex items-center gap-2">
                  <span>{font.name}</span>
                  {font.ligatures && (
                    <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Sparkles className="w-2.5 h-2.5" />
                      ligatures
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Size Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Font Size</span>
          <span className="font-mono text-emerald-400">{fontSize}px</span>
        </div>
        <input
          type="range"
          min="10"
          max="24"
          step="1"
          value={fontSize}
          onChange={(e) => onChangeFontSize(Number(e.target.value))}
          className="w-full accent-emerald-400 cursor-pointer"
        />
      </div>

      {/* Line Height Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Line Height</span>
          <span className="font-mono text-emerald-400">{lineHeight.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="1.2"
          max="2.4"
          step="0.1"
          value={lineHeight}
          onChange={(e) => onChangeLineHeight(Number(e.target.value))}
          className="w-full accent-emerald-400 cursor-pointer"
        />
      </div>
    </div>
  );
};

