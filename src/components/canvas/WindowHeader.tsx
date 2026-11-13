'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FrameDefinition } from '@/types';
import { Terminal, Globe, Lock, Minus, Square, X, ChevronDown, Check, Sparkles } from 'lucide-react';
import { detectLanguage } from '@/core/syntax';

interface WindowHeaderProps {
  frame: FrameDefinition;
  fileName: string;
  language: string;
  isAutoDetected?: boolean;
  onFileNameChange?: (name: string) => void;
  onLanguageChange?: (language: string, isAuto?: boolean) => void;
  isEditable?: boolean;
}

const COMMON_LANGUAGES = [
  { id: 'auto', label: 'Auto Detect' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'rust', label: 'Rust' },
  { id: 'go', label: 'Go' },
  { id: 'cpp', label: 'C++' },
  { id: 'c', label: 'C' },
  { id: 'java', label: 'Java' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'swift', label: 'Swift' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'json', label: 'JSON' },
  { id: 'yaml', label: 'YAML' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'sql', label: 'SQL' },
  { id: 'bash', label: 'Bash / Shell' },
  { id: 'php', label: 'PHP' },
  { id: 'ruby', label: 'Ruby' },
];

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  frame,
  fileName,
  language,
  isAutoDetected = true,
  onFileNameChange,
  onLanguageChange,
  isEditable = true,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!frame.hasHeader || frame.style === 'none') {
    return null;
  }

  const handleFileNameUpdate = (newName: string) => {
    onFileNameChange?.(newName);
    // Auto-detect language from extension
    if (isAutoDetected && onLanguageChange) {
      const detected = detectLanguage(newName, '');
      if (detected) {
        onLanguageChange(detected, true);
      }
    }
  };

  const handleSelectLanguage = (langId: string) => {
    if (langId === 'auto') {
      const detected = detectLanguage(fileName, '');
      onLanguageChange?.(detected, true);
    } else {
      onLanguageChange?.(langId, false);
    }
    setIsLangOpen(false);
  };

  return (
    <div className="relative flex items-center justify-between px-4 py-2.5 select-none border-b border-white/10 bg-white/5 backdrop-blur-md rounded-t-xl z-20">
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
            onChange={(e) => handleFileNameUpdate(e.target.value)}
            className="bg-transparent text-xs text-white/80 hover:text-white focus:text-white font-mono text-center outline-none border-b border-transparent focus:border-white/30 px-1.5 py-0.5 rounded transition truncate"
            title="Click to edit filename (extension auto-detects language)"
            placeholder="untitled.ts"
          />
        ) : (
          <span className="text-xs text-white/70 font-mono truncate">{fileName}</span>
        )}
      </div>

      {/* Right controls: Language Badge & Windows Controls */}
      <div className="flex items-center gap-2">
        {/* Interactive Language Selector Badge */}
        <div className="relative" ref={langDropdownRef}>
          <button
            type="button"
            onClick={() => setIsLangOpen((prev) => !prev)}
            className="flex items-center gap-1 text-[11px] font-mono tracking-wide px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 transition cursor-pointer"
            title="Click to change language or auto-detection"
          >
            {isAutoDetected && <Sparkles className="w-2.5 h-2.5 text-emerald-400 mr-0.5" />}
            <span className="capitalize">{language}</span>
            <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          {/* Language Dropdown Menu */}
          {isLangOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 max-h-56 overflow-y-auto custom-scrollbar bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-1 z-50">
              <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Syntax Language
              </div>
              {COMMON_LANGUAGES.map((item) => {
                const isSelected = item.id === 'auto' ? isAutoDetected : language === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectLanguage(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Windows Frame Controls */}
        {frame.style === 'windows' && (
          <div className="flex items-center gap-2 text-white/60 ml-2">
            <Minus className="w-3 h-3 hover:text-white cursor-pointer" />
            <Square className="w-2.5 h-2.5 hover:text-white cursor-pointer" />
            <X className="w-3 h-3 hover:text-red-400 cursor-pointer" />
          </div>
        )}
      </div>
    </div>
  );
};
