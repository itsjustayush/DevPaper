'use client';

import React from 'react';
import { listThemes } from '@/registries/themes';
import { ThemeDefinition } from '@/types';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentThemeId,
  onSelectTheme,
}) => {
  const themes = listThemes();

  return (
    <div className="grid grid-cols-2 gap-2">
      {themes.map((theme) => {
        const isSelected = theme.id === currentThemeId;
        return (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            className={`flex items-center gap-2.5 p-2 rounded-xl text-left border transition text-xs ${
              isSelected
                ? 'border-emerald-400 bg-white/10 text-white font-medium'
                : 'border-white/5 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <div
              className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center shadow-sm"
              style={{ backgroundColor: theme.background }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: theme.accent || theme.syntax.keywords }}
              />
            </div>
            <span className="truncate flex-1">{theme.name}</span>
            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};

