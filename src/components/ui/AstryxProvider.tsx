'use client';

import React, { useEffect } from 'react';
import { listFonts } from '@/registries/fonts';

interface AstryxProviderProps {
  children: React.ReactNode;
}

/**
 * Astryx Design System & Typography Provider
 * 
 * Injects Meta Astryx CSS variables, theme-neutral design tokens,
 * and preloads curated open-source developer fonts with ligature features.
 */
export const AstryxProvider: React.FC<AstryxProviderProps> = ({ children }) => {
  useEffect(() => {
    // Preload font stylesheets dynamically
    const fonts = listFonts();
    fonts.forEach((font) => {
      if (font.webFontUrl) {
        const id = `font-link-${font.id}`;
        if (!document.getElementById(id)) {
          const link = document.createElement('link');
          link.id = id;
          link.rel = 'stylesheet';
          link.href = font.webFontUrl;
          document.head.appendChild(link);
        }
      }
    });
  }, []);

  return (
    <div className="astryx-theme-root dark min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-white">
      {children}
    </div>
  );
};

