'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Copy,
  Check,
  Download,
  Code2,
  BookOpen,
  Sparkles,
  Bot,
  Zap,
  ArrowRight,
  ExternalLink,
  Layers,
  FileCode,
  Sliders,
} from 'lucide-react';
import { render_svg_client_preview } from './clientPreview';

const AGENT_SYSTEM_PROMPT = `You have access to the DevPaper Headless Typesetting API to generate high-polish code snippet images (SVG, PNG) and multi-page printable documents (PDF, ZIP).

### Base URL:
- Local / Self-hosted: http://localhost:8000
- Zero authentication or API keys required.

### When to Use DevPaper:
1. Documentation & READMEs: Whenever creating or enhancing a repository README, generate a vector SVG snippet hero banner.
2. Architecture / API Guides: Typeset code examples into crisp images or multi-page PDF documents for users.
3. Bug Reports & PR Reviews: Create visual before/after code comparisons with diff markers ('+' or '-').
4. Code Bundling: When packaging multiple files, generate a clean ZIP archive with both source and rendered images.

### How to Generate a Single Snippet (POST /api/v1/snippet):
Endpoint: POST http://localhost:8000/api/v1/snippet
Content-Type: application/json

Payload:
{
  "code": "<source code string>",
  "language": "python" | "typescript" | "rust" | "go" | "auto",
  "file_name": "example.py",
  "theme": "tokyo-night" | "one-dark-pro" | "dracula" | "catppuccin" | "nord" | "github-dark",
  "background": "cosmic-sunset" | "aurora" | "neon-dusk" | "ember-glow" | "transparent",
  "frame": "macos" | "windows" | "terminal" | "minimal",
  "show_line_numbers": true,
  "format": "svg" | "pdf" | "html"
}

### How to Embed in Markdown (GET /api/v1/snippet):
You can embed live snippet images directly in Markdown or HTML without downloading files:
![Code Architecture](http://localhost:8000/api/v1/snippet?code=<url_encoded_code>&lang=python&name=main.py)

### How to Batch Render Multiple Files to ZIP (POST /api/v1/files):
Endpoint: POST http://localhost:8000/api/v1/files
Payload:
{
  "files": [
    {"name": "server.py", "code": "...", "language": "python"},
    {"name": "client.ts", "code": "...", "language": "typescript"}
  ],
  "format": "zip",
  "archive_name": "project-snippets"
}

Full compact spec available at: /ai.txt
`;

export default function AgentDocsPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Playground state
  const [code, setCode] = useState<string>(
    '# DevPaper API Example\ndef calculate_roi(investment: float, gain: float) -> float:\n    """Calculates return on investment percentage."""\n    return ((gain - investment) / investment) * 100\n\nprint(f"ROI: {calculate_roi(1000, 1450):.2f}%")'
  );
  const [language, setLanguage] = useState<string>('python');
  const [fileName, setFileName] = useState<string>('roi.py');
  const [theme, setTheme] = useState<string>('tokyo-night');
  const [background, setBackground] = useState<string>('cosmic-sunset');
  const [frame, setFrame] = useState<string>('macos');
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2200);
  };

  // Generate live SVG preview directly in browser for instant sandbox feedback
  const previewSvg = useMemo(() => {
    return render_svg_client_preview({
      code,
      language,
      fileName,
      theme,
      background,
      frame,
      showLineNumbers,
    });
  }, [code, language, fileName, theme, background, frame, showLineNumbers]);

  const curlSnippet = useMemo(() => {
    const payload = JSON.stringify(
      {
        code,
        language,
        file_name: fileName,
        theme,
        background,
        frame,
        show_line_numbers: showLineNumbers,
        format: 'svg',
      },
      null,
      2
    );

    return `curl -X POST http://localhost:8000/api/v1/snippet \\
  -H "Content-Type: application/json" \\
  -d '${payload.replace(/'/g, "'\\''")}' \\
  --output ${fileName.replace(/\.[^/.]+$/, '')}.svg`;
  }, [code, language, fileName, theme, background, frame, showLineNumbers]);

  const pythonSnippet = useMemo(() => {
    return `import requests

payload = {
    "code": """${code}""",
    "language": "${language}",
    "file_name": "${fileName}",
    "theme": "${theme}",
    "background": "${background}",
    "format": "svg"
}

response = requests.post("http://localhost:8000/api/v1/snippet", json=payload)
with open("${fileName.replace(/\.[^/.]+$/, '')}.svg", "wb") as f:
    f.write(response.content)

print("Snippet saved successfully!")`;
  }, [code, language, fileName, theme, background]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col antialiased selection:bg-emerald-500/30">
      {/* Top Navbar */}
      <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-zinc-100 hover:text-white transition">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm tracking-tight">DevPaper</span>
            <span className="text-[11px] font-mono text-zinc-500">/ agent</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/ai"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Compact Spec (/ai)</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold transition"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-10 space-y-12">
        {/* Hero Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>Zero-Auth Developer & AI Agent API</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
            Headless Code Typesetting for Agents & CLI
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Empower AI coding agents, GitHub Actions, and command-line scripts to generate beautiful code images (SVG, PNG), multi-page printable documents (PDF), and bundled archives (ZIP) with zero authentication or API keys.
          </p>
        </div>

        {/* Section 1: Pre-Made AI Agent System Prompt */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                <span>AI Agent System Prompt (Copy & Paste)</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Paste this into Cursor (<code className="text-zinc-300">.cursorrules</code>), Claude Code (<code className="text-zinc-300">CLAUDE.md</code>), Windsurf, or custom agent tools.
              </p>
            </div>

            <button
              onClick={() => handleCopy(AGENT_SYSTEM_PROMPT, 'agent-prompt')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-medium transition cursor-pointer"
            >
              {copiedSection === 'agent-prompt' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Prompt!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Agent Prompt</span>
                </>
              )}
            </button>
          </div>

          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 overflow-x-auto max-h-72 custom-scrollbar">
            <pre className="whitespace-pre">{AGENT_SYSTEM_PROMPT}</pre>
          </div>
        </section>

        {/* Section 2: Interactive Live API Sandbox */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>Interactive API Playground</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Test request parameters live. Generates matching vector SVG and exact cURL / Python code snippets.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Input Parameters */}
            <div className="space-y-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Filename</label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 outline-none focus:border-emerald-400 font-mono transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 outline-none focus:border-emerald-400 font-mono transition"
                  >
                    <option value="python">Python</option>
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="rust">Rust</option>
                    <option value="go">Go</option>
                    <option value="sql">SQL</option>
                    <option value="html">HTML</option>
                    <option value="bash">Bash / Shell</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-200 outline-none focus:border-emerald-400 font-mono transition"
                  >
                    <option value="tokyo-night">Tokyo Night</option>
                    <option value="one-dark-pro">One Dark Pro</option>
                    <option value="dracula">Dracula</option>
                    <option value="catppuccin">Catppuccin</option>
                    <option value="nord">Nord</option>
                    <option value="monokai">Monokai Pro</option>
                    <option value="github-dark">GitHub Dark</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Background</label>
                  <select
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-200 outline-none focus:border-emerald-400 font-mono transition"
                  >
                    <option value="cosmic-sunset">Cosmic Sunset</option>
                    <option value="aurora">Aurora</option>
                    <option value="neon-dusk">Neon Dusk</option>
                    <option value="ember-glow">Ember Glow</option>
                    <option value="ocean-abyss">Ocean Abyss</option>
                    <option value="obsidian">Obsidian</option>
                    <option value="transparent">Transparent</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Frame</label>
                  <select
                    value={frame}
                    onChange={(e) => setFrame(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-200 outline-none focus:border-emerald-400 font-mono transition"
                  >
                    <option value="macos">macOS Filled</option>
                    <option value="macos-outline">macOS Outline</option>
                    <option value="terminal">Terminal</option>
                    <option value="windows">Windows</option>
                    <option value="minimal">Minimal</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              {/* Code Editor Textarea */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-zinc-400 font-medium">Source Code</label>
                  <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showLineNumbers}
                      onChange={(e) => setShowLineNumbers(e.target.checked)}
                      className="accent-emerald-400 rounded cursor-pointer"
                    />
                    <span>Line Numbers</span>
                  </label>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={6}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-200 outline-none focus:border-emerald-400 transition"
                  placeholder="Paste code here..."
                />
              </div>

              {/* Generated cURL command */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">cURL Command</span>
                  <button
                    onClick={() => handleCopy(curlSnippet, 'curl-code')}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
                  >
                    {copiedSection === 'curl-code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'curl-code' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto custom-scrollbar">
                  {curlSnippet}
                </pre>
              </div>
            </div>

            {/* Right: Live Rendered Output */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
              <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-zinc-800 text-xs text-zinc-400">
                <span>Live Vector Preview (Real-time Render)</span>
                <span className="font-mono text-emerald-400">SVG Format</span>
              </div>

              {/* Interactive SVG Preview */}
              <div
                className="max-w-full overflow-x-auto shadow-2xl rounded-2xl transition-all"
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />
            </div>
          </div>
        </section>

        {/* Section 3: API Reference (Plain English) */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span>Plain English API Reference</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Simple REST endpoints that accept JSON and return downloadable files directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Endpoint 1: Single Snippet */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  POST
                </span>
                <code className="text-xs font-mono text-zinc-200">/api/v1/snippet</code>
              </div>
              <p className="text-xs text-zinc-400">
                Typeset a code snippet into an SVG, PDF, or HTML document. Returns the file directly with appropriate <code className="text-zinc-300">Content-Type</code> headers.
              </p>
              <div className="text-[11px] font-mono text-zinc-500 space-y-1 border-t border-zinc-900 pt-2">
                <div>Input: <span className="text-zinc-300">code, language, theme, font, frame, format</span></div>
                <div>Output: <span className="text-emerald-400">image/svg+xml</span> or <span className="text-emerald-400">application/pdf</span></div>
              </div>
            </div>

            {/* Endpoint 2: Direct Image URL */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  GET
                </span>
                <code className="text-xs font-mono text-zinc-200">/api/v1/snippet</code>
              </div>
              <p className="text-xs text-zinc-400">
                Instant image generation via URL query parameters. Embed dynamic code snippet images directly into Markdown READMEs or HTML tags without local storage.
              </p>
              <div className="text-[11px] font-mono text-zinc-500 space-y-1 border-t border-zinc-900 pt-2">
                <div>Params: <span className="text-zinc-300">?code=...&lang=python&theme=dracula</span></div>
                <div>Output: <span className="text-emerald-400">image/svg+xml</span></div>
              </div>
            </div>

            {/* Endpoint 3: Multi-File Batch to ZIP */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  POST
                </span>
                <code className="text-xs font-mono text-zinc-200">/api/v1/files</code>
              </div>
              <p className="text-xs text-zinc-400">
                Submit an array of source files to bundle into a sequentially numbered ZIP archive or merged multi-page PDF document.
              </p>
              <div className="text-[11px] font-mono text-zinc-500 space-y-1 border-t border-zinc-900 pt-2">
                <div>Input: <span className="text-zinc-300">{`files: [{name, code, language}], format: "zip"`}</span></div>
                <div>Output: <span className="text-emerald-400">application/zip</span> (contains source & SVGs)</div>
              </div>
            </div>

            {/* Endpoint 4: Metadata Introspection */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  GET
                </span>
                <code className="text-xs font-mono text-zinc-200">/api/v1/themes | /fonts | /frames</code>
              </div>
              <p className="text-xs text-zinc-400">
                Introspection endpoints allowing autonomous agents to query available color themes, typography choices, and window styles at runtime.
              </p>
              <div className="text-[11px] font-mono text-zinc-500 space-y-1 border-t border-zinc-900 pt-2">
                <div>Returns: <span className="text-zinc-300">JSON list of IDs, names, and color tokens</span></div>
                <div>Auth: <span className="text-emerald-400">None required</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Python Integration Example */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <span>Python Integration (Requests / HTTPX)</span>
            </h2>
            <button
              onClick={() => handleCopy(pythonSnippet, 'python-code')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-300 hover:text-white transition cursor-pointer"
            >
              {copiedSection === 'python-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'python-code' ? 'Copied' : 'Copy Python'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300 overflow-x-auto custom-scrollbar">
            {pythonSnippet}
          </pre>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 px-6 text-center text-xs text-zinc-500 font-mono">
        DevPaper Open-Source Code Studio & Headless API • <a href="https://github.com/DevPaper/devpaper" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 underline">github.com/DevPaper/devpaper</a>
      </footer>
    </div>
  );
}
