# DevPaper

> **The aesthetic code presentation studio & multi-page typesetting engine.**  
> Merging the visual polish of modern code-image generators (**ray.so**, **Carbon**, **Glyph**) with a document-grade pagination engine (**Google Docs / MS Word for code**) and a headless Python microservice for AI agents.

[![CI Status](https://github.com/DevPaper/devpaper/actions/workflows/ci.yml/badge.svg)](https://github.com/DevPaper/devpaper/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Semantic Versioning](https://img.shields.io/badge/SemVer-2.0.0-orange)](https://semver.org)

---

## 💡 Why DevPaper?

Traditional code screenshot tools (such as Ray.so and Carbon) create beautiful single-frame cards, but fall short when presented with real-world technical source files (50 to 2,000+ lines). Long files either get clipped awkwardly, squashed, or require manual cropping.

**DevPaper solves this with a unified, content-aware workspace and headless API:**

1. **🎨 Interactive Code Studio (Single-Frame & Multi-Page)**:
   - Type or paste code directly in a distraction-free, content-aware editor with auto language detection.
   - Flow arbitrarily long source files across sequential physical sheets (**A4, Letter, A3, 16:9 Slides**) with continuous line numbering, running headers, footers, and block-boundary protection.
   - Export high-resolution PNGs, lossless vector SVGs, merged multi-page PDFs, and numbered ZIP packages.
2. **⚡ Headless Python API & AI Agent Engine (`/agent` & `/ai`)**:
   - Built-in zero-auth FastAPI microservice allowing developers and AI agents (Cursor, Claude Code, Windsurf, Copilot, Antigravity) to typeset code into vector SVGs, multi-page PDFs, or bundled ZIP archives.
   - Direct image query URL for Markdown READMEs and website HTML (`<img src="...">`).

---

## 🌐 Public API & Interfaces

DevPaper exposes four clearly-defined public interfaces:

### 1. Headless REST API (FastAPI)
The headless Python backend serves zero-auth endpoints at `http://localhost:8000`:
* `POST /api/v1/snippet`: Typesets a code block into a downloadable **SVG**, **PDF**, or **HTML** file.
* `GET /api/v1/snippet`: Direct image query endpoint for GitHub `README.md` and website embedding.
* `POST /api/v1/files`: Batch renders whole repositories/files into a downloadable **ZIP archive** (with `source/`, `snippets/`, and `MANIFEST.md`) or merged PDF.
* `GET /api/v1/themes`, `/backgrounds`, `/fonts`, `/frames`: Machine-readable registry endpoints.

### 2. AI Agent Specification
* [`/ai.txt`](public/ai.txt): Ultra-compact, token-efficient system prompt directive for LLMs.
* [`/agent.json`](public/agent.json): OpenAPI-compliant JSON schema for automated tool calling.
* `/agent`: Interactive developer playground and system prompt library.

### 3. Core TypeScript Engine (Library Mode)
* `src/core/paginator.ts`: Pure mathematical code-flow calculator (`calculatePagination(...)`).
* `src/core/syntax.ts`: Universal syntax highlighter with automatic language detection.
* `src/core/exporters/`: Vector SVG, Blob-streamed PNG, jsPDF document, and JSZip packagers.

### 4. Declarative Plugin Registries
* `src/registries/themes.ts`: Syntax color palettes.
* `src/registries/fonts.ts`: Monospace developer typography.
* `src/registries/frames.ts`: Window chrome styles (macOS, Windows, Terminal, Minimal).
* `src/registries/paperSizes.ts`: Physical and digital page dimensions.

---

## ✨ Features

### Visual Code Composition
* **Syntax Highlighting**: TextMate accurate highlighting for 100+ languages with automatic detection.
* **Themes**: Curated palettes including *Tokyo Night*, *One Dark Pro*, *Dracula*, *Catppuccin Mocha*, *Nord*, *Synthwave '84*, *GitHub Dark/Light*, and *Obsidian*.
* **Typography**: Bundled developer fonts (*JetBrains Mono*, *Fira Code*, *Geist Mono*, *Cascadia Code*, *IBM Plex Mono*, *Source Code Pro*) with full ligature support (`font-variant-ligatures`).
* **Window Chrome**: macOS Traffic Lights (filled, outline, monochrome), Windows 11 controls, Terminal `$ bash`, or minimal.
* **Wallpapers & Canvas**: Aurora, Cosmic Sunset, Neon Dusk, Ember Glow, Ocean Abyss, Obsidian, and transparent backgrounds with configurable padding.

### Document-Grade Pagination Engine
* **Physical Paper Standards**: A4, A3, A5, US Letter, US Legal, US Tabloid (Portrait & Landscape).
* **Presentation & Social Presets**: 16:9 Keynote/Slide, 4:3 Slide, OpenGraph Card (1200×630), GitHub README Hero Banner (1280×480).
* **Continuous Line Numbering**: Preserves original file line indices across all page boundaries.
* **Running Headers & Footers**: Automatic document title, filename, page numbers (`Page X of Y`), and author watermark.

### High-Performance Export Suite
* 📋 **Copy to Clipboard**: Instant 2x Retina PNG copy via the async Web Clipboard API.
* 🖼️ **Lossless Vector SVG**: Pure XML vector files with zero pixelation at any zoom level.
* 📑 **Merged Multi-Page PDF**: Native vector PDF generator matching exact physical dimensions.
* 📦 **Bundled ZIP Archive**: Client-side generated `.zip` containing sequentially numbered page images.

---

## 🚀 Quick Start

### 1. Web Studio (Frontend)

```bash
# Clone the repository
git clone https://github.com/DevPaper/devpaper.git
cd devpaper

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open DevPaper Studio.

### 2. Headless Python Backend

```bash
cd backend
python -m venv .venv

# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python run.py
```

The API starts at [http://localhost:8000](http://localhost:8000) (Interactive Swagger docs: `/docs`).

---

## 🤖 Direct README Image Embedding

AI agents and developers can insert live code images directly into markdown without saving files locally:

```markdown
![Architecture](http://localhost:8000/api/v1/snippet?code=const+app+=+new+Hono();&lang=typescript&name=server.ts)
```

---

## 🧪 Testing

DevPaper features comprehensive automated test suites across both TypeScript and Python:

```bash
# Run Vitest unit tests (Frontend & Core Engines)
npm test

# Run Python backend test suite (FastAPI, Pygments, ReportLab)
npm run test:backend
```

---

## 👥 Used by

Projects and organizations that have publicly confirmed they use this project:

- [Project Alpha](https://github.com/example/project-alpha) — uses `devpaper` for request validation and code documentation — v1.0.0
- [Company Beta](https://example.com) — uses `devpaper` in its internal developer platform — confirmed 2026-11

Want to be listed? [Submit the “Add my project” form](https://github.com/DevPaper/devpaper/issues/new?template=used_by.yml).

This list is community-reported and does not imply endorsement. Ask us to remove or update an entry at any time. See [ADOPTERS.md](ADOPTERS.md) for the full directory.

---

## 🤝 Contributing

We welcome contributions from everyone! Unaffiliated contributors should use the **fork-and-pull-request model**.

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:
* Short-lived branch conventions (`feature/*`, `fix/*`, `docs/*`, `chore/*`).
* Pull request review guidelines and GitHub Rulesets.
* Step-by-step guides for adding new themes, fonts, or paper size presets.

Please also read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before participating.

---

## 🔒 Security

For security vulnerability reporting, please see [SECURITY.md](SECURITY.md). Please report vulnerabilities privately via [GitHub Security Advisories](https://github.com/DevPaper/devpaper/security/advisories/new) or by emailing **security@devpaper.org**.

---

## 📜 Citation

If you use DevPaper in academic research, technical papers, or documentation, please cite it using the metadata in [CITATION.cff](CITATION.cff).

---

## 📄 License

DevPaper is open-source software licensed under the **[MIT License](LICENSE)** (OSI-approved).  
Copyright (c) 2026 DevPaper Contributors.
