'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { ThemeDefinition, FontDefinition } from '@/types';
import { tokenizeCodeLine, detectLanguage } from '@/core/syntax';

interface InlineCodeEditorProps {
  code: string;
  language: string;
  theme: ThemeDefinition;
  font: FontDefinition;
  fontSize: number;
  lineHeight: number;
  showLineNumbers: boolean;
  lineWrapping: boolean;
  highlightedLines?: number[];
  onCodeChange: (newCode: string) => void;
  onLanguageChange?: (newLang: string) => void;
  onToggleLineHighlight?: (lineNumber: number) => void;
}

export const InlineCodeEditor: React.FC<InlineCodeEditorProps> = ({
  code,
  language,
  theme,
  font,
  fontSize,
  lineHeight,
  showLineNumbers,
  lineWrapping,
  highlightedLines = [],
  onCodeChange,
  onLanguageChange,
  onToggleLineHighlight,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Split lines
  const lines = useMemo(() => {
    return code.split(/\r?\n/);
  }, [code]);

  const maxDigits = useMemo(() => {
    return Math.max(2, String(lines.length).length);
  }, [lines.length]);

  // Handle auto-resizing textarea to fit code height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(140, textareaRef.current.scrollHeight)}px`;
    }
  }, [code, fontSize, lineHeight, lineWrapping]);

  // Sync scroll positions between transparent textarea and syntax highlight layer
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlightRef.current) {
      highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
      highlightRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Handle Tab, Enter (auto-indent), and keyboard interactions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    if (e.key === 'Tab') {
      e.preventDefault();
      // Insert 2 spaces
      const updated = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
      onCodeChange(updated);

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      });
      return;
    }

    if (e.key === 'Enter') {
      // Find indentation of current line
      const currentLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const currentLine = value.substring(currentLineStart, selectionStart);
      const matchIndent = currentLine.match(/^(\s+)/);
      const indent = matchIndent ? matchIndent[1] : '';

      // If current line ends with opening bracket
      const shouldIncreaseIndent = /[{\(\[]$/.test(currentLine.trimEnd());
      const extraIndent = shouldIncreaseIndent ? '  ' : '';

      e.preventDefault();
      const updated =
        value.substring(0, selectionStart) +
        '\n' +
        indent +
        extraIndent +
        value.substring(selectionEnd);
      onCodeChange(updated);

      requestAnimationFrame(() => {
        const newPos = selectionStart + 1 + indent.length + extraIndent.length;
        textarea.selectionStart = textarea.selectionEnd = newPos;
      });
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    onCodeChange(newCode);

    // Content-aware auto language detection
    if (onLanguageChange && newCode.trim().length > 5) {
      const detected = detectLanguage(undefined, newCode);
      if (detected && detected !== language) {
        onLanguageChange(detected);
      }
    }
  };

  const fontStyle: React.CSSProperties = {
    fontFamily: font.fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeight}`,
    fontVariantLigatures: font.ligatures ? 'contextual' : 'none',
    fontFeatureSettings: font.ligatures ? '"calt" 1' : 'normal',
    tabSize: 2,
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-stretch w-full min-h-[140px] select-text"
      style={fontStyle}
    >
      {/* Gutter / Line Numbers */}
      {showLineNumbers && (
        <div
          className="select-none flex flex-col items-end pr-3 pl-4 py-3 border-r border-white/5 text-white/25 shrink-0 transition-colors"
          style={{
            width: `${maxDigits * 0.75 + 2.2}rem`,
            userSelect: 'none',
          }}
        >
          {lines.map((_, idx) => {
            const lineNum = idx + 1;
            const isHighlighted = highlightedLines.includes(lineNum);
            return (
              <button
                key={lineNum}
                type="button"
                onClick={() => onToggleLineHighlight?.(lineNum)}
                className={`w-full text-right hover:text-white/80 transition-colors font-mono cursor-pointer ${
                  isHighlighted ? 'text-emerald-400 font-bold' : ''
                }`}
                style={{
                  height: `${fontSize * lineHeight}px`,
                  lineHeight: `${fontSize * lineHeight}px`,
                }}
                title={`Click to highlight line ${lineNum}`}
              >
                {lineNum}
              </button>
            );
          })}
        </div>
      )}

      {/* Editor Content Area (Layered Syntax + Textarea) */}
      <div className="relative flex-1 min-w-0">
        {/* Layer 1: Syntax Highlighted Rendering */}
        <div
          ref={highlightRef}
          className="pointer-events-none select-none py-3 px-4 w-full overflow-hidden"
          aria-hidden="true"
        >
          {lines.map((lineText, idx) => {
            const lineNum = idx + 1;
            const isHighlighted = highlightedLines.includes(lineNum);
            const tokens = tokenizeCodeLine(lineText, language, theme);

            // Detect diff markers
            const isDiffAdd = lineText.startsWith('+') && !lineText.startsWith('++');
            const isDiffRemove = lineText.startsWith('-') && !lineText.startsWith('--');

            return (
              <div
                key={idx}
                className={`flex items-start transition-colors ${
                  isHighlighted ? 'rounded px-1' : ''
                }`}
                style={{
                  height: `${fontSize * lineHeight}px`,
                  lineHeight: `${fontSize * lineHeight}px`,
                  backgroundColor: isDiffAdd
                    ? theme.diffAdd
                    : isDiffRemove
                    ? theme.diffRemove
                    : isHighlighted
                    ? theme.lineHighlight
                    : 'transparent',
                }}
              >
                <div
                  className={`flex-1 font-mono ${
                    lineWrapping ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
                  }`}
                >
                  {tokens.map((token, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        color: token.color,
                        fontStyle: token.isComment ? 'italic' : 'normal',
                      }}
                    >
                      {token.content}
                    </span>
                  ))}
                  {tokens.length === 0 && <span>&nbsp;</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer 2: Transparent Interactive Textarea Overlay */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={`devpaper-no-export absolute inset-0 w-full h-full py-3 px-4 bg-transparent outline-none border-none resize-none overflow-hidden font-mono text-transparent cursor-text select-text selection:bg-emerald-500/35 selection:text-transparent ${
            lineWrapping ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
          }`}
          style={{
            ...fontStyle,
            caretColor: theme.cursor || '#64ffda',
          }}
          placeholder="Type or paste code here..."
        />
      </div>
    </div>
  );
};
