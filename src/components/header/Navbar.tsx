'use client';

import React from 'react';
import {
  FileCode,
  Layers,
  Sparkles,
  Share2,
  FilePlus,
  Trash2,
  BookOpen,
  Code2,
} from 'lucide-react';
import { SourceFileItem } from '@/types';

interface NavbarProps {
  mode: 'canvas' | 'codepaper';
  onChangeMode: (mode: 'canvas' | 'codepaper') => void;
  files: SourceFileItem[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onAddFile: () => void;
  onDeleteFile: (fileId: string) => void;
  onShareUrl: () => void;
  onLoadPreset: () => void;
  onSavePreset: () => void;
  shareCopied: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onChangeMode,
  files,
  activeFileId,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onShareUrl,
  onLoadPreset,
  onSavePreset,
  shareCopied,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 z-40 px-4 flex items-center justify-between">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold text-sm tracking-tight text-white select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20">
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            DevPaper
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Studio
          </span>
        </div>

        {/* Mode Switcher: Canvas vs CodePaper */}
        <div className="hidden sm:flex items-center p-1 bg-white/5 border border-white/10 rounded-xl ml-4">
          <button
            onClick={() => onChangeMode('canvas')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
              mode === 'canvas'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Canvas</span>
          </button>
          <button
            onClick={() => onChangeMode('codepaper')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
              mode === 'codepaper'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CodePaper (Multi-Page)</span>
          </button>
        </div>
      </div>

      {/* Middle: File Tabs (active in CodePaper mode) */}
      {mode === 'codepaper' && (
        <div className="hidden lg:flex items-center gap-1.5 max-w-md overflow-x-auto custom-scrollbar py-1">
          {files.map((file) => {
            const isActive = file.id === activeFileId;
            return (
              <div
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer transition border ${
                  isActive
                    ? 'border-emerald-400 bg-white/10 text-white'
                    : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[100px]">{file.name}</span>
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
          <button
            onClick={onAddFile}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/10 transition"
            title="Add another source file to document"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onShareUrl}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition"
          title="Encode state into shareable URL"
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">{shareCopied ? 'Link Copied!' : 'Share'}</span>
        </button>

        <a
          href="https://github.com/meta/astryx"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition"
          title="Astryx Design System"
        >
          <Code2 className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};
