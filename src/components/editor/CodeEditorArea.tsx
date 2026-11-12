'use client';

import React, { useRef } from 'react';
import {
  Upload,
  Code2,
  Sparkles,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, detectLanguage } from '@/core/syntax';

interface CodeEditorAreaProps {
  code: string;
  language: string;
  fileName: string;
  onChangeCode: (newCode: string) => void;
  onChangeLanguage: (newLang: string) => void;
  onChangeFileName: (newName: string) => void;
  onAutoDetect: () => void;
}

export const CodeEditorArea: React.FC<CodeEditorAreaProps> = ({
  code,
  language,
  fileName,
  onChangeCode,
  onChangeLanguage,
  onChangeFileName,
  onAutoDetect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChangeFileName(file.name);
    const detected = detectLanguage(file.name);
    onChangeLanguage(detected);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (typeof content === 'string') {
        onChangeCode(content);
      }
    };
    reader.readAsText(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Intercept Tab to insert 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChangeCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white">Source Editor</span>

          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-emerald-400 transition"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-zinc-900 text-white">
                {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={onAutoDetect}
            className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white px-2 py-1 rounded bg-white/5 transition"
            title="Auto-detect language from source content"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Auto</span>
          </button>
        </div>

        {/* Upload / File Input */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".ts,.tsx,.js,.jsx,.py,.rs,.go,.cpp,.c,.java,.kt,.swift,.rb,.php,.sql,.html,.css,.json,.yaml,.yml,.md,.sh,.zig"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import File</span>
          </button>
        </div>
      </div>

      {/* Code Textarea with Tab Support */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={10}
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-xs font-mono text-white/90 outline-none focus:border-emerald-400 transition resize-y selection:bg-emerald-500/30 custom-scrollbar leading-relaxed"
          placeholder="Paste or write your source code here..."
          spellCheck={false}
        />
        <div className="absolute bottom-3 right-3 text-[10px] text-white/30 font-mono select-none pointer-events-none">
          {code.split(/\r?\n/).length} lines • {code.length} chars
        </div>
      </div>
    </div>
  );
};

