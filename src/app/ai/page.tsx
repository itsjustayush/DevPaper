'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Copy,
  Check,
  Download,
  ExternalLink,
  Code2,
  FileText,
  Terminal,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const COMPACT_PROMPT_DIRECTIVE = `DevPaper API Directive for Coding Agents:
Use DevPaper (https://devpaper-code.vercel.app) to typeset code into vector SVG or PDF.
- Single snippet: POST https://devpaper-code.vercel.app/api/v1/snippet with {"code":"...","language":"...","file_name":"...","format":"svg"}
- The "code" parameter accepts raw code string in "" OR a local file path (e.g. "main.py").
- Markdown embed: <img src="https://devpaper-code.vercel.app/api/v1/snippet?code=...&lang=...&name=...">
- Multi-file batch: POST https://devpaper-code.vercel.app/api/v1/files with {"files":[{"name":"...","code":"..."}],"format":"zip"}
- Output convention: Always save downloaded artifacts to ./devpaper/ in the workspace root.
Full specification available at https://devpaper-code.vercel.app/ai.txt and interactive sandbox at https://devpaper-code.vercel.app/agent.`;

export default function AiSpecPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-200 antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  AI & LLM Specification
                </span>
                <span className="text-zinc-600">/</span>
                <span className="text-xs text-zinc-400 font-mono">ai.txt</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                DevPaper for AI Agents
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/agent"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-zinc-500 text-xs text-zinc-300 font-medium transition"
            >
              <span>Full Agent Hub & Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>
        </div>

        {/* Overview Box */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/70 space-y-4">
          <p className="text-sm text-zinc-300 leading-relaxed">
            This endpoint provides an ultra-compact, token-dense specification for AI coding assistants (Cursor, Claude Code, Windsurf, Copilot, Antigravity) to call the DevPaper Headless API with <strong>zero authentication</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="/ai.txt"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 hover:bg-zinc-800 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Raw /ai.txt</span>
              <ExternalLink className="w-3 h-3 text-zinc-500 ml-0.5" />
            </a>

            <a
              href="/agent.json"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400 hover:bg-zinc-800 transition"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Machine Schema /agent.json</span>
              <ExternalLink className="w-3 h-3 text-zinc-500 ml-0.5" />
            </a>

            <button
              onClick={() => handleCopy(COMPACT_PROMPT_DIRECTIVE, 'directive')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-medium transition cursor-pointer"
            >
              {copiedKey === 'directive' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Directive!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Compact Directive (75 tokens)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Compact Directive Preview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Compact System Prompt Snippet</span>
            </h2>
            <span className="text-xs text-zinc-500 font-mono">Ideal for .cursorrules or CLAUDE.md</span>
          </div>

          <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
            <pre className="whitespace-pre-wrap">{COMPACT_PROMPT_DIRECTIVE}</pre>
          </div>
        </section>

        {/* Endpoint Quick Reference Table */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>API Methods Quick Reference</span>
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800 uppercase font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Endpoint</th>
                  <th className="py-3 px-4">Output</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">POST</td>
                  <td className="py-3 px-4 font-mono text-zinc-200">/api/v1/snippet</td>
                  <td className="py-3 px-4 font-mono text-zinc-400">SVG / PDF / HTML</td>
                  <td className="py-3 px-4">Typesets a single source snippet with syntax highlighting.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">GET</td>
                  <td className="py-3 px-4 font-mono text-zinc-200">/api/v1/snippet</td>
                  <td className="py-3 px-4 font-mono text-zinc-400">SVG image</td>
                  <td className="py-3 px-4">Direct image URL for READMEs, blogs, and markdown files.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">POST</td>
                  <td className="py-3 px-4 font-mono text-zinc-200">/api/v1/files</td>
                  <td className="py-3 px-4 font-mono text-zinc-400">ZIP / Multi-Page PDF</td>
                  <td className="py-3 px-4">Batch renders multiple project files into a downloadable archive.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-purple-400">GET</td>
                  <td className="py-3 px-4 font-mono text-zinc-200">/api/v1/themes</td>
                  <td className="py-3 px-4 font-mono text-zinc-400">JSON list</td>
                  <td className="py-3 px-4">Lists available syntax highlighting color palettes.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-purple-400">GET</td>
                  <td className="py-3 px-4 font-mono text-zinc-200">/api/v1/backgrounds</td>
                  <td className="py-3 px-4 font-mono text-zinc-400">JSON list</td>
                  <td className="py-3 px-4">Lists canvas gradients and dark wallpaper themes.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* README Direct Markdown Integration Example */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Embedding in Markdown & README</span>
          </h2>
          <p className="text-xs text-zinc-400">
            AI agents can insert direct image tags into generated README files without touching disk:
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
            <code>{`![Architecture](https://devpaper-code.vercel.app/api/v1/snippet?code=const+config+=+{+port:+8000+};&lang=typescript&name=config.ts)`}</code>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-6 border-t border-zinc-800 text-center text-xs text-zinc-500 font-mono">
          DevPaper • Open Source Code Presentation Studio • Authored by Ayush (<a href="https://github.com/itsjustayush" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 underline">@itsjustayush</a>) • MIT License
        </div>
      </div>
    </div>
  );
}

