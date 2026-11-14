# DevPaper

> **The aesthetic code presentation studio & multi-page typesetting engine.**  
> Merging the visual polish of modern code-image generators (**ray.so**, **Carbon**, **Glyph**) with a document-grade pagination engine (**Google Docs / MS Word for code**) and a headless Python microservice for AI agents.  
> 🌐 **Live Web App**: [https://devpaper-code.vercel.app](https://devpaper-code.vercel.app)

[![Live Studio](https://img.shields.io/badge/Live_App-devpaper--code.vercel.app-000000?style=flat&logo=vercel)](https://devpaper-code.vercel.app)
[![CI Status](https://github.com/DevPaper/devpaper/actions/workflows/ci.yml/badge.svg)](https://github.com/DevPaper/devpaper/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Author: Ayush](https://img.shields.io/badge/Author-Ayush%20(@itsjustayush)-blue.svg)](https://github.com/itsjustayush)
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
   - Export high-resolution PNGs, lossless vector SVGs, merged multi-page PDFs, and numbered ZIP packages with sub-second rendering.
2. **⚡ Headless Python API & AI Agent Engine (`/agent` & `/ai`)**:
   - Built-in zero-auth FastAPI microservice allowing developers and AI agents (Cursor, Claude Code, Windsurf, Copilot, Antigravity) to typeset code into vector SVGs, multi-page PDFs, or bundled ZIP archives.
   - Direct image query URL for Markdown READMEs and website HTML (`<img src="...">`).

---

## ⚡ Visual Comparison: Standard Markdown vs. DevPaper Typesetting

See the dramatic difference between standard plain Markdown and DevPaper's vector presentation engine:

### 1. Standard Plain Markdown Code Block
```python
def fibonacci(n: int) -> int:
    """Return the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Compute first 10 Fibonacci numbers
fib_sequence = [fibonacci(i) for i in range(10)]
print(f"Fibonacci: {fib_sequence}")
```

### 2. DevPaper Typeset Output (Generated via API)
<p align="center">
  <img src="public/examples/fibonacci.svg" alt="DevPaper Typeset Fibonacci Code Snippet" width="620" />
</p>

*✨ Crisp JetBrains Mono typography, Tokyo Night syntax highlighting, Cosmic Sunset gradient, macOS traffic lights, gutter line numbers, and soft drop shadow — available as vector SVG, Retina PNG, or multi-page PDF.*

---

## 🌐 Public API & Subsystems Overview

DevPaper exposes four clearly-defined public interfaces:

1. **Headless REST API (FastAPI)**: Serves zero-auth endpoints at `http://localhost:8000` for generating vector SVG, PDF, or ZIP packages.
2. **AI Agent Specifications & Hub**:
   - Live Studio & Hub: [https://devpaper-code.vercel.app/agent](https://devpaper-code.vercel.app/agent)
   - Plaintext Prompt Directive: [`https://devpaper-code.vercel.app/ai.txt`](https://devpaper-code.vercel.app/ai.txt)
   - Machine-Readable Schema: [`https://devpaper-code.vercel.app/agent.json`](https://devpaper-code.vercel.app/agent.json)
3. **Core TypeScript Engine (Library Mode)**:
   - `src/core/paginator.ts`: Pure mathematical code-flow calculator (`calculatePagination(...)`).
   - `src/core/syntax.ts`: Universal syntax highlighter with automatic language detection.
   - `src/core/exporters/`: Vector SVG, Blob-streamed PNG, jsPDF document, and JSZip packagers.
4. **Declarative Plugin Registries**:
   - `src/registries/themes.ts`: Syntax color palettes.
   - `src/registries/fonts.ts`: Monospace developer typography.
   - `src/registries/frames.ts`: Window chrome styles (macOS, Windows, Terminal, Minimal).
   - `src/registries/paperSizes.ts`: Physical and digital page dimensions.

---

## 🔌 Complete Headless API Reference

The DevPaper Headless API runs on Python (FastAPI + Pygments + ReportLab) with **zero authentication required** and **CORS enabled (`*`)**, making it effortlessly callable by local CLI scripts, web apps, and AI coding agents.

* **Base URL**: `http://localhost:8000` (or your deployed host)
* **Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI) / [http://localhost:8000/redoc](http://localhost:8000/redoc) (ReDoc)
* **Auth**: None required (open public endpoints)

### Endpoint Summary

| Method | Endpoint | Output | Purpose |
|---|---|---|---|
| `POST` | `/api/v1/snippet` | SVG / PDF / HTML | Typesets a single code block into an image or document. |
| `GET` | `/api/v1/snippet` | SVG Image | Direct URL for GitHub `README.md` and website embedding. |
| `POST` | `/api/v1/files` | ZIP / Merged PDF | Batch renders entire folders or multiple files into a bundle. |
| `GET` | `/api/v1/themes` | JSON Array | Lists all available syntax color themes. |
| `GET` | `/api/v1/backgrounds` | JSON Array | Lists all canvas wallpapers and gradient presets. |
| `GET` | `/api/v1/fonts` | JSON Array | Lists all bundled monospace developer fonts. |
| `GET` | `/api/v1/frames` | JSON Array | Lists window chrome framing options. |
| `GET` | `/api/v1/health` | JSON Object | Service health check. |

---

### 🛡️ Zero Cloud Storage & Complete Privacy Guarantee

DevPaper has **no cloud storage facility**:
* **Web Users**: Runs **100% client-side in your browser** using local DOM canvas and client engines. It is an ephemeral, one-time session; your code is never uploaded, tracked, or stored on any remote database or cloud server. Users download and export files locally on their device.
* **Programmatic & API Users**: The headless backend processes code **100% in-memory** using streaming buffers (`io.BytesIO`). Once the HTTP response stream is returned, no copies, logs, or snippets are persisted on the server.

---

### 📂 Programmatic Workspace Output Convention (`/devpaper`)

For developers, CLI scripts, and AI agents invoking DevPaper programmatically:
* All generated and downloaded files of any format (`.pdf`, `.svg`, `.png`, `.zip`, `.html`) are saved into a dedicated **`/devpaper`** folder located at the root of your workspace (`./devpaper/<file_name>.<ext>`).
* This convention keeps code repositories clean and organizes all typeset documentation assets into one predictable location.
* Make sure `devpaper/` is added to your project's `.gitignore` if you do not wish to track generated export artifacts in Git.

---

### 1. Generate Single Snippet (`POST /api/v1/snippet`)

Converts a code snippet into a high-polish, vector-crisp standalone file.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Parameters (JSON)

| Field | Type | Default | Required | Description |
|---|---|---|:---:|---|
| `code` | `string` | — | **Yes** | Source code to be typeset. |
| `language` | `string` | `"auto"` | No | Target language (e.g. `python`, `typescript`, `rust`, `go`, `sql`). Auto-detected if `"auto"`. |
| `file_name` | `string` | `"snippet.txt"` | No | File name displayed in the window header chrome. |
| `theme` | `string` | `"tokyo-night"` | No | Theme ID: `tokyo-night`, `one-dark-pro`, `dracula`, `catppuccin`, `nord`, `monokai`, `github-dark`, `github-light`, `synthwave-84`. |
| `background` | `string` | `"cosmic-sunset"` | No | Canvas wallpaper: `cosmic-sunset`, `aurora`, `neon-dusk`, `ember-glow`, `ocean-abyss`, `obsidian`, `transparent`. |
| `font` | `string` | `"jetbrains-mono"` | No | Developer font: `jetbrains-mono`, `fira-code`, `geist-mono`, `ibm-plex-mono`, `cascadia-code`, `source-code-pro`. |
| `frame` | `string` | `"macos"` | No | Window frame: `macos`, `macos-outline`, `macos-monochrome`, `windows`, `terminal`, `minimal`, `none`. |
| `show_line_numbers`| `boolean` | `true` | No | Whether to render gutter line numbers. |
| `start_line` | `integer` | `1` | No | Starting index for line numbering. |
| `padding` | `integer` | `48` | No | Outer canvas padding in pixels (`16`, `32`, `48`, `64`, `128`). |
| `border_radius` | `integer` | `16` | No | Window corner radius in pixels. |
| `watermark` | `string` | `"DevPaper"` | No | Watermark label in bottom right corner (pass `""` to omit). |
| `highlight_lines` | `integer[]` | `[]` | No | Array of 1-based line numbers to emphasize. |
| `format` | `string` | `"svg"` | No | Export format: `"svg"` (vector SVG), `"pdf"` (vector PDF), or `"html"`. |

#### Response
Binary stream with `Content-Disposition: attachment; filename="<file_name>.<format>"`:
* `image/svg+xml` (for `format: "svg"`)
* `application/pdf` (for `format: "pdf"`)
* `text/html; charset=utf-8` (for `format: "html"`)

#### Example cURL
```bash
# Save to the /devpaper workspace directory:
mkdir -p devpaper
curl -X POST http://localhost:8000/api/v1/snippet \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def quicksort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr) // 2]\n    return quicksort([x for x in arr if x < pivot]) + [x for x in arr if x == pivot] + quicksort([x for x in arr if x > pivot])",
    "language": "python",
    "file_name": "quicksort.py",
    "theme": "tokyo-night",
    "background": "aurora",
    "frame": "macos",
    "format": "svg"
  }' \
  --output devpaper/quicksort.svg
```

#### Example Python (`requests`)
```python
import os
import requests

os.makedirs("devpaper", exist_ok=True)

payload = {
    "code": "const greet = (name: string): string => `Hello, ${name}!`;",
    "language": "typescript",
    "file_name": "greet.ts",
    "theme": "one-dark-pro",
    "background": "cosmic-sunset",
    "format": "svg"
}

response = requests.post("http://localhost:8000/api/v1/snippet", json=payload)
with open("devpaper/greet.svg", "wb") as f:
    f.write(response.content)
```

#### 📁 Direct File Input (No Copy-Pasting Required!)
Instead of copying and pasting or escaping multi-line code into JSON strings, you can pass any local file path directly (e.g. `main.py`, `samplegreet.ts`, `index.html`) via `"code"` or `"file_path"`. The API will read, format, and auto-detect the language from disk:

```python
import os
import requests

os.makedirs("devpaper", exist_ok=True)

payload = {
    "code": "samplegreet.ts",      # Pass any file path directly! (or "file_path": "main.py")
    "language": "typescript",
    "file_name": "greet.ts",
    "theme": "one-dark-pro",
    "background": "cosmic-sunset",
    "format": "pdf"                # Generates a vector PDF directly from the file!
}

response = requests.post("http://localhost:8000/api/v1/snippet", json=payload)
with open("devpaper/greet.pdf", "wb") as f:
    f.write(response.content)
```

#### 📤 Direct Multipart File Upload (`POST /api/v1/snippet/upload`)
You can also upload source files directly using standard multipart form-data:

```bash
# Upload a file via curl and get a vector PDF in devpaper/:
mkdir -p devpaper
curl -X POST http://localhost:8000/api/v1/snippet/upload \
  -F "file=@main.py" \
  -F "theme=tokyo-night" \
  -F "format=pdf" \
  --output devpaper/main.pdf
```

#### Example JavaScript / TypeScript (`fetch`)
```typescript
const response = await fetch("http://localhost:8000/api/v1/snippet", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code: 'fn main() { println!("Hello from Rust!"); }',
    language: "rust",
    file_name: "main.rs",
    theme: "dracula",
    format: "svg",
  }),
});

const blob = await response.blob();
```

---

### 2. Direct Markdown / README Image Embedding (`GET /api/v1/snippet`)

Allows embedding live syntax-highlighted code images directly into markdown files or web pages without saving files to disk.

#### URL Syntax:
```markdown
![Hero Snippet](http://localhost:8000/api/v1/snippet?code=SELECT%20*%20FROM%20users%20WHERE%20active%20=%20true;&lang=sql&name=query.sql&theme=tokyo-night&bg=cosmic-sunset)
```

#### HTML Syntax:
```html
<img src="http://localhost:8000/api/v1/snippet?code=const+pi+=+3.14159;&lang=typescript&name=math.ts" alt="Code Snippet" />
```

#### Query Parameters:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | `"print('Hello from DevPaper API')"` | URL-encoded source code string. |
| `lang` | `string` | `"auto"` | Language identifier (auto-detects if omitted). |
| `name` | `string` | `"snippet.txt"` | Display name shown in window header. |
| `theme` | `string` | `"tokyo-night"` | Syntax theme palette ID. |
| `bg` | `string` | `"cosmic-sunset"` | Canvas wallpaper background ID. |
| `font` | `string` | `"jetbrains-mono"` | Font family ID. |
| `frame` | `string` | `"macos"` | Window chrome frame (`macos`, `windows`, `terminal`, `minimal`). |
| `lines` | `boolean` | `true` | Show gutter line numbering (`true` / `false`). |
| `format` | `string` | `"svg"` | Output image format (`svg`). |

---

### 3. Batch Multi-File Packaging (`POST /api/v1/files`)

Takes multiple source files and packages them into a bundled **ZIP archive** or a **merged multi-page PDF**.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Parameters (JSON)
```json
{
  "files": [
    {
      "name": "server.py",
      "code": "from fastapi import FastAPI\napp = FastAPI()\n\n@app.get('/')\ndef root():\n    return {'status': 'healthy'}",
      "language": "python"
    },
    {
      "name": "docker-compose.yml",
      "code": "version: '3.8'\nservices:\n  api:\n    build: .\n    ports:\n      - '8000:8000'",
      "language": "yaml"
    }
  ],
  "format": "zip",
  "theme": "tokyo-night",
  "background": "cosmic-sunset",
  "archive_name": "microservice-bundle"
}
```

#### Output ZIP Structure
When `format: "zip"`, returns a clean archive organized for documentation and distribution:
```text
microservice-bundle.zip
├── MANIFEST.md              # Auto-generated index with metadata and file list
├── source/                  # Original raw code files
│   ├── server.py
│   └── docker-compose.yml
└── snippets/                # Vector SVG typeset images
    ├── server.svg
    └── docker-compose.svg
```

#### Example cURL
```bash
# Save bundle into the /devpaper directory:
mkdir -p devpaper
curl -X POST http://localhost:8000/api/v1/files \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {"name": "index.ts", "code": "export const VERSION = \"1.0.0\";", "language": "typescript"},
      {"name": "types.ts", "code": "export type ID = string | number;", "language": "typescript"}
    ],
    "format": "zip",
    "archive_name": "ts-types-bundle"
  }' \
  --output devpaper/bundle.zip
```

---

### 4. Registry Introspection Endpoints

These endpoints allow IDE extensions, CLI tools, and AI agents to introspect available options dynamically.

#### `GET /api/v1/themes`
Returns an array of available theme palettes:
```json
[
  { "id": "tokyo-night", "name": "Tokyo Night", "type": "dark" },
  { "id": "one-dark-pro", "name": "One Dark Pro", "type": "dark" },
  { "id": "dracula", "name": "Dracula", "type": "dark" },
  { "id": "catppuccin", "name": "Catppuccin Mocha", "type": "dark" },
  { "id": "nord", "name": "Nord", "type": "dark" },
  { "id": "monokai", "name": "Monokai Pro", "type": "dark" },
  { "id": "github-dark", "name": "GitHub Dark", "type": "dark" },
  { "id": "github-light", "name": "GitHub Light", "type": "light" },
  { "id": "synthwave-84", "name": "Synthwave '84", "type": "dark" }
]
```

#### `GET /api/v1/backgrounds`
Returns available wallpaper backgrounds:
```json
[
  { "id": "cosmic-sunset", "name": "Cosmic Sunset" },
  { "id": "aurora", "name": "Aurora" },
  { "id": "neon-dusk", "name": "Neon Dusk" },
  { "id": "ember-glow", "name": "Ember Glow" },
  { "id": "ocean-abyss", "name": "Ocean Abyss" },
  { "id": "obsidian", "name": "Obsidian Solid" },
  { "id": "transparent", "name": "Transparent" }
]
```

#### `GET /api/v1/fonts`
Returns available developer fonts:
```json
[
  { "id": "jetbrains-mono", "name": "JetBrains Mono" },
  { "id": "fira-code", "name": "Fira Code" },
  { "id": "geist-mono", "name": "Geist Mono" },
  { "id": "ibm-plex-mono", "name": "IBM Plex Mono" },
  { "id": "cascadia-code", "name": "Cascadia Code" },
  { "id": "source-code-pro", "name": "Source Code Pro" }
]
```

#### `GET /api/v1/frames`
Returns available window chrome frame styles:
```json
[
  { "id": "macos", "name": "macOS Traffic Lights (Filled)" },
  { "id": "macos-outline", "name": "macOS Outline" },
  { "id": "macos-monochrome", "name": "macOS Monochrome" },
  { "id": "windows", "name": "Windows 11 Controls" },
  { "id": "terminal", "name": "Terminal Shell ($ bash)" },
  { "id": "minimal", "name": "Minimalist Header" },
  { "id": "none", "name": "Borderless / None" }
]
```

---

## ✨ Studio Features

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

### 🌐 Live Production Studio
Open **[https://devpaper-code.vercel.app](https://devpaper-code.vercel.app)** in any modern web browser — no installation needed.

### 💻 Local Development Setup

#### 1. Web Studio (Frontend)

```bash
# Clone the repository
git clone https://github.com/DevPaper/devpaper.git
cd devpaper

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open DevPaper Studio locally.

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

## 🧪 Testing & API Runner

DevPaper features automated test suites across both TypeScript and Python, plus a standalone API test runner:

```bash
# 1. Run Vitest unit tests (Frontend & Core Engines)
npm test

# 2. Run Python backend test suite (FastAPI, Pygments, ReportLab)
npm run test:backend

# 3. Interactive API Test Script (Generates sample code, runs API, downloads PDF/SVG)
python apitest.py
# Or test with any file on your computer:
python apitest.py main.py
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

For security vulnerability reporting, please see [SECURITY.md](SECURITY.md). Please report vulnerabilities privately via [GitHub Security Advisories](https://github.com/DevPaper/devpaper/security/advisories/new) or by emailing **itsjustayush.dev@gmail.com**.

---

## 📜 Citation

If you use DevPaper in academic research, technical papers, or documentation, please cite it using the metadata in [CITATION.cff](CITATION.cff):

```bibtex
@software{devpaper2026,
  author = {Ayush and DevPaper Contributors},
  title = {DevPaper: Code Presentation and Multi-Page Typesetting Studio},
  year = {2026},
  url = {https://github.com/DevPaper/devpaper},
  version = {1.0.0}
}
```

---

## ⚖️ Authors, Contact & Legal Notices

DevPaper is authored, designed, and maintained by **Ayush** ([@itsjustayush](https://github.com/itsjustayush)) along with the DevPaper Contributors.

For any questions, support, or direct contact, reach out to **itsjustayush.dev@gmail.com**.

### License
DevPaper is open-source software licensed under the **[MIT License](LICENSE)** (an OSI-approved permissive license):

```text
MIT License

Copyright (c) 2026 Ayush (@itsjustayush) and DevPaper Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
