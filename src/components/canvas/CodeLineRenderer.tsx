'use client';

import React from 'react';
import { PaginatedLine, ThemeDefinition, FontDefinition } from '@/types';
import { tokenizeCodeLine } from '@/core/syntax';

interface CodeLineRendererProps {
  line: PaginatedLine;
  language: string;
  theme: ThemeDefinition;
  font: FontDefinition;
  fontSize: number;
  lineHeight: number;
  showLineNumbers: boolean;
  maxLineNumberDigits?: number;
}

export const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({
  line,
  language,
  theme,
  font,
  fontSize,
  lineHeight,
  showLineNumbers,
  maxLineNumberDigits = 3,
}) => {
  const tokens = React.useMemo(() => {
    return tokenizeCodeLine(line.rawText, language, theme);
  }, [line.rawText, language, theme]);

  const isDiffAdd = line.diffType === 'add';
  const isDiffRemove = line.diffType === 'remove';

  const lineStyle: React.CSSProperties = {
    fontFamily: font.fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeight}`,
    fontVariantLigatures: font.ligatures ? 'contextual' : 'none',
    fontFeatureSettings: font.ligatures ? '"calt" 1' : 'normal',
    backgroundColor: isDiffAdd
      ? theme.diffAdd
      : isDiffRemove
      ? theme.diffRemove
      : line.isHighlighted
      ? theme.lineHighlight
      : 'transparent',
    opacity: line.isDimmed ? 0.35 : 1,
    transition: 'opacity 0.15s ease, background-color 0.15s ease',
  };

  return (
    <div
      className={`group flex items-start px-4 hover:bg-white/[0.03] transition-colors ${
        line.isHighlighted ? 'border-l-2 border-emerald-400' : 'border-l-2 border-transparent'
      }`}
      style={lineStyle}
    >
      {/* Line Number Gutter */}
      {showLineNumbers && (
        <span
          className="select-none text-right pr-4 shrink-0 font-mono text-white/30 group-hover:text-white/60 transition-colors"
          style={{
            width: `${Math.max(2, maxLineNumberDigits) * 0.7 + 1}rem`,
            userSelect: 'none',
          }}
        >
          {line.lineNumber}
        </span>
      )}

      {/* Diff Marker Column */}
      <span className="select-none w-4 shrink-0 font-mono text-center font-bold">
        {isDiffAdd && <span className="text-emerald-400">+</span>}
        {isDiffRemove && <span className="text-rose-400">-</span>}
      </span>

      {/* Code Tokens */}
      <div className="flex-1 whitespace-pre break-all font-mono">
        {tokens.map((token, idx) => (
          <span
            key={idx}
            style={{
              color: token.color,
              fontStyle: token.isComment ? 'italic' : 'normal',
            }}
          >
            {token.content}
          </span>
        ))}
      </div>
    </div>
  );
};
