'use client';

import React from 'react';
import { FrameDefinition } from '@/types';
import { Terminal, Globe, Lock, Minus, Square, X } from 'lucide-react';

interface WindowHeaderProps {
  frame: FrameDefinition;
  fileName: string;
  language: string;
  onFileNameChange?: (name: string) => void;
  isEditable?: boolean;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  frame,
  fileName,
  language,
  onFileNameChange,
  isEditable = true,
}) => {
  if (!frame.hasHeader || frame.style === 'none') {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 select-none border-b border-white/10 bg-white/5 backdrop-blur-md rounded-t-xl">
      {/* Left controls */}
      <div className="flex items-center gap-2">
        {frame.style === 'macos-filled' && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] shadow-sm hover:opacity-80 transition" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] shadow-sm hover:opacity-80 transition" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] shadow-sm hover:opacity-80 transition" />
          </div>
        )}

        {frame.style === 'macos-outline' && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-[#ff5f56] bg-transparent" />
            <span className="w-3 h-3 rounded-full border-2 border-[#ffbd2e] bg-transparent" />
            <span className="w-3 h-3 rounded-full border-2 border-[#27c93f] bg-transparent" />
          </div>
        )}

        {frame.style === 'macos-monochrome' && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-white/20 hover:bg-white/30 transition" />
            <span className="w-3 h-3 rounded-full bg-white/20 hover:bg-white/30 transition" />
            <span className="w-3 h-3 rounded-full bg-white/20 hover:bg-white/30 transition" />
          </div>
        )}

        {frame.style === 'terminal' && (
          <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>bash</span>
          </div>
        )}

        {frame.style === 'browser' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-white/60 bg-black/20 px-2 py-0.5 rounded">
              <Lock className="w-3 h-3 text-emerald-400" />
              <Globe className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>

      {/* Center: File Name / Document Title */}
      <div className="flex items-center gap-2 max-w-[50%] overflow-hidden">
        {isEditable ? (
          <input
            type="text"
            value={fileName}
            onChange={(e) => onFileNameChange?.(e.target.value)}
            className="bg-transparent text-xs text-white/70 hover:text-white focus:text-white font-mono text-center outline-none border-b border-transparent focus:border-white/30 px-1 py-0.5 rounded transition truncate"
            title="Click to edit filename"
            placeholder="untitled.ts"
          />
        ) : (
          <span className="text-xs text-white/70 font-mono truncate">{fileName}</span>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {frame.style === 'windows' ? (
          <div className="flex items-center gap-3 text-white/60">
            <Minus className="w-3 h-3 hover:text-white cursor-pointer" />
            <Square className="w-2.5 h-2.5 hover:text-white cursor-pointer" />
            <X className="w-3 h-3 hover:text-red-400 cursor-pointer" />
          </div>
        ) : (
          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/60 font-medium">
            {language}
          </span>
        )}
      </div>
    </div>
  );
};

