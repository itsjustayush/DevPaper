'use client';

import React from 'react';
import Link from 'next/link';
import {
  Share2,
  Download,
  Copy,
  Check,
  Bot,
  FolderOpen,
} from 'lucide-react';

interface NavbarProps {
  onShareUrl: () => void;
  shareCopied: boolean;
  onOpenExportModal: () => void;
  onQuickCopy: () => void;
  quickCopied: boolean;
  onOpenFile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onShareUrl,
  shareCopied,
  onOpenExportModal,
  onQuickCopy,
  quickCopied,
  onOpenFile,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 z-40 px-4 sm:px-6 flex items-center justify-between">
      {/* Brand Logo & Title (Clean Geometric DevPaper Mark - No AI Slop) */}
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="flex items-center gap-2.5 font-sans select-none group transition"
          title="DevPaper Studio"
        >
          {/* Architectural Folded Paper + Code Mark */}
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-zinc-100 group-hover:border-zinc-500 transition shadow-sm">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-zinc-100"
            >
              {/* Document sheet with folded upper right corner */}
              <path
                d="M5 4C5 2.89543 5.89543 2 7 2H14L20 8V20C20 21.1046 19.1046 22 18 22H7C5.89543 22 5 21.1046 5 20V4Z"
                fill="#18181b"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* Internal code bracket runes */}
              <path
                d="M9.5 12L8 14L9.5 16"
                stroke="#10b981"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.5 12L16 14L14.5 16"
                stroke="#10b981"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 11.5L11.5 16.5"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-white transition">
              DevPaper
            </span>
            <span className="hidden sm:inline text-[11px] text-zinc-500 font-mono tracking-tight">
              / typeset
            </span>
          </div>
        </a>
      </div>

      {/* Center: Context Indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Content-Aware Studio</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Open Local File */}
        {onOpenFile && (
          <button
            onClick={onOpenFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-850 hover:border-zinc-700 text-xs font-medium text-zinc-200 transition cursor-pointer"
            title="Open local source file (main.py, index.html, etc.)"
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Open File</span>
          </button>
        )}
        {/* Quick Copy to Clipboard */}
        <button
          onClick={onQuickCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-850 hover:border-zinc-700 text-xs font-medium text-zinc-200 transition cursor-pointer"
          title="Quick Copy 2x PNG to Clipboard"
        >
          {quickCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span className="hidden sm:inline">{quickCopied ? 'Copied!' : 'Copy'}</span>
        </button>

        {/* Share URL State */}
        <button
          onClick={onShareUrl}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-850 hover:border-zinc-700 text-xs font-medium text-zinc-200 transition cursor-pointer"
          title="Encode snippet state into shareable URL"
        >
          {shareCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Share2 className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span className="hidden sm:inline">{shareCopied ? 'Link Copied' : 'Share'}</span>
        </button>

        {/* Export Studio Modal Trigger */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold shadow-sm transition cursor-pointer"
          title="Open Export & Sizing Studio (PDF, PNG, SVG, ZIP)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* API & AI Agent Hub */}
        <Link
          href="/agent"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/70 hover:bg-zinc-850 hover:border-zinc-700 text-xs font-medium text-zinc-300 transition"
          title="DevPaper Headless API & Agent Prompt Hub"
        >
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span>API / Agent</span>
        </Link>

        <div className="w-[1px] h-4 bg-zinc-800 mx-1 hidden sm:block" />

        {/* Official GitHub DevPaper Link with Authentic Octocat Icon */}
        <a
          href="https://github.com/DevPaper/devpaper"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          title="View DevPaper on GitHub"
          aria-label="DevPaper on GitHub"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="transition-transform group-hover:scale-105"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        </a>
      </div>
    </header>
  );
};
