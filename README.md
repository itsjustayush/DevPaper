# DevPaper

> **The aesthetic code presentation studio & multi-page typesetting engine.**  
> Merging the visual polish of modern code-image generators (**ray.so**, **Carbon**, **Glyph**) with a document-grade pagination engine (**Google Docs / MS Word for code**).

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Meta Astryx](https://img.shields.io/badge/Meta-Astryx-0866ff?logo=meta)](https://github.com/meta/astryx)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 💡 Why DevPaper?

Traditional code screenshot tools (such as Ray.so and Carbon) create beautiful single-frame images, but fail when presented with real-world technical source files (50 to 2,000+ lines). Long files either get clipped awkwardly, squashed, or require manual cropping.

**DevPaper solves this by introducing two closely integrated workspaces:**

1. **🎨 Code Canvas (Single-Snippet Mode):** Visual parity with `ray.so`, `carbon.now.sh`, and `Rajpolu/glyph`. Instant high-DPI cards with gradients, custom fonts, glassmorphism, traffic lights, and clipboard copy.
2. **📄 CodePaper (Multi-Page Document Mode):** True document-grade pagination. Flows arbitrarily long source files across sequential physical sheets (A4, Letter, A3, 16:9 Slides) with continuous line numbering, running headers, footers, block-boundary protection, and multi-page PDF/ZIP exports.

---

## ✨ Features

### Visual Code Composition
* **Syntax Highlighting:** TextMate accurate highlighting for 25+ major languages with auto-detection.
* **Themes:** 13+ curated developer themes including *Tokyo Night*, *One Dark Pro*, *Dracula*, *Catppuccin Mocha*, *Nord*, *Synthwave '84*, *GitHub Dark/Light*, *Vitesse*, *Rosé Pine*, and *Black Metal*.
* **Typography:** Bundled developer fonts (*JetBrains Mono*, *Fira Code*, *Geist Mono*, *Cascadia Code*, *IBM Plex Mono*, *Source Code Pro*, *Space Mono*, *Victor Mono*) with full ligature support.
* **Window Chrome:** macOS Classic Filled, macOS Outline, macOS Monochrome, Windows 11 Modern, Terminal Shell, Browser Tab, Minimalist Pill, or Borderless.
* **Wallpapers & Canvas:** Mesh gradients, linear gradients, solid obsidian/cream, transparent backgrounds, and customizable canvas padding (`16px`, `32px`, `64px`, `128px`).
* **Line Highlights & Diffs:** Interactive line highlighting, line focusing (dimming unfocused lines), and diff markers (`+` green / `-` red).

### Document-Grade Pagination Engine
* **Physical Paper Standards:** A4, A3, A5, US Letter, US Legal, US Tabloid (Portrait & Landscape).
* **Presentation & Social Presets:** 16:9 Keynote/Slide, 4:3 Slide, OpenGraph Card (1200×630), GitHub README Hero Banner (1280×480), Square Post.
* **Continuous Line Numbering:** Preserves exact original file line indices across all page boundaries.
* **Smart Page-Breaks:** Avoids breaking inside function or block declarations near page bottoms.
* **Running Headers & Footers:** Automatic document title, file name, language badge, page numbers (`Page X of Y`), and author watermark.
* **Dual Preview:** Switch between continuous vertical **Document Stream** and multi-column **Grid Overview**.

### Complete Export Suite
* 📋 **Copy to Clipboard:** One-click instant Retina PNG copy to system clipboard.
* 🖼️ **High-DPI Images:** Lossless SVG, Web PNG (1x), and Retina High-Res PNG (2x).
* 📑 **Merged Multi-Page PDF:** Crisp, print-ready vector PDF matching true physical page dimensions (e.g. true ISO A4 PDF).
* 📦 **Bundled ZIP Archive:** Client-side generated `.zip` containing sequentially numbered high-res images (`file-page-01.png`, `file-page-02.png`, ...).
* 🔗 **Shareable URLs:** Full canvas and document configurations encoded into shareable URL hashes.

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: v20 or later
* **Package Manager**: `pnpm` (recommended) or `npm`

### Installation
```bash
# Clone repository
git clone https://github.com/your-org/devpaper.git
cd devpaper

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

DevPaper maintains decoupled core modules with comprehensive unit tests:

```bash
# Run Vitest test suite
pnpm test
```

---

## 🏛️ Architecture & Extensibility

DevPaper is designed with strict subsystem boundaries:
* `src/registries/` — Declarative registries for themes, fonts, frames, and paper presets.
* `src/core/paginator.ts` — Pure mathematical pagination engine.
* `src/core/syntax.ts` — Universal syntax tokenizer.
* `src/core/exporters/` — Standalone export implementations.

For a full architectural breakdown and data flow diagram, see [ARCHITECTURE.md](file:///e:/Projects/DevPaper/ARCHITECTURE.md).

To contribute new themes, fonts, or formats, see [CONTRIBUTING.md](file:///e:/Projects/DevPaper/CONTRIBUTING.md).

---

## 💖 Reference Acknowledgements

DevPaper draws direct inspiration and architecture from:
* **[Meta Astryx](https://github.com/meta/astryx)** — Design system, accessible UI chrome, and dark-mode-first tokens.
* **[Ray.so](https://github.com/raycast/ray-so)** — Visual elegance, floating bottom dock layout, and preset ergonomics.
* **[Glyph](https://github.com/Rajpolu/glyph)** — Multi-language visual styling and developer font pairings.
* **[Carbon](https://github.com/carbon-app/carbon)** — Customizable window frames and canvas properties.

---

## 📄 License

MIT © [DevPaper Contributors](LICENSE)

