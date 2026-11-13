# DevPaper Headless Python Backend

A lightning-fast, zero-auth, high-performance headless code typesetting and presentation microservice built with **FastAPI**, **Pygments**, and **ReportLab**.

DevPaper API converts raw code blocks or multi-file repositories into pixel-perfect vector **SVG**, multi-page **PDF**, or bundled **ZIP** archives suitable for READMEs, technical documentation, architectural guides, and social cards.

---

## Features

- **Pure Vector SVG Renderer**: Sub-10ms vector SVG generation with zero headless browser / Chromium overhead.
- **Multi-Page Vector PDF Engine**: Flow source code across A4, Letter, or A3 printable sheets with running headers and continuous line numbers.
- **Batch ZIP Packager**: Package source code along with rendered vector snippets and an automated `MANIFEST.md`.
- **100+ Languages Supported**: Automatic language detection and syntax highlighting via Pygments.
- **Window Frames**: macOS traffic lights (filled, outline, monochrome), Windows 11 controls, Terminal `$ bash`, or minimal.
- **Designer Gradients & Wallpapers**: Cosmic Sunset, Aurora, Neon Dusk, Ember Glow, Ocean Abyss, Obsidian, and transparent backgrounds.
- **Zero Authentication**: Open API designed for local tools, developers, and AI agents (Cursor, Claude Code, Windsurf, Copilot, Antigravity).
- **CORS Enabled**: Out-of-the-box cross-origin support for web frontends, CLI tools, and agent sandboxes.

---

## Quickstart

### 1. Requirements
- Python 3.10+
- `pip` or `uv`

### 2. Install Dependencies

Using `pip`:
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

Or using `uv`:
```bash
uv venv
uv pip install -r requirements.txt
```

### 3. Start the Server

```bash
python run.py
```

The server starts at `http://localhost:8000`.
- Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 4. Run Test Suite

```bash
python test_api.py
```

---

## API Reference

### 1. Generate Single Snippet (POST `/api/v1/snippet`)

Converts a code snippet into an SVG, PDF, or HTML document.

**Request:**
```http
POST /api/v1/snippet HTTP/1.1
Content-Type: application/json

{
  "code": "def fib(n):\n    return n if n <= 1 else fib(n-1) + fib(n-2)",
  "language": "python",
  "file_name": "fib.py",
  "theme": "tokyo-night",
  "background": "cosmic-sunset",
  "font": "jetbrains-mono",
  "frame": "macos",
  "show_line_numbers": true,
  "start_line": 1,
  "format": "svg"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/v1/snippet \
  -H "Content-Type: application/json" \
  -d '{"code":"print(\"Hello World\")","language":"python","file_name":"hello.py","format":"svg"}' \
  --output hello.svg
```

**Python Example:**
```python
import requests

res = requests.post("http://localhost:8000/api/v1/snippet", json={
    "code": "console.log('DevPaper');",
    "language": "javascript",
    "file_name": "app.js",
    "format": "svg"
})

with open("snippet.svg", "wb") as f:
    f.write(res.content)
```

---

### 2. Direct Markdown / README Image Embed (GET `/api/v1/snippet`)

Allows generating snippet images directly via URL query parameters for GitHub `README.md` or website HTML `<img />` tags without saving locally.

```markdown
![Architecture](http://localhost:8000/api/v1/snippet?code=SELECT%20*%20FROM%20users&lang=sql&theme=tokyo-night&name=query.sql)
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `code` | string | `print("Hello DevPaper")` | Raw code string (URL-encoded) |
| `lang` | string | `auto` | Programming language (auto-detects if omitted) |
| `name` | string | `snippet.txt` | Display filename in window header |
| `theme` | string | `tokyo-night` | Syntax theme palette |
| `bg` | string | `cosmic-sunset` | Canvas wallpaper background |
| `frame` | string | `macos` | Window frame style (`macos`, `windows`, `terminal`, `minimal`) |
| `lines` | boolean | `true` | Show gutter line numbering |

---

### 3. Batch Multi-File Packaging (POST `/api/v1/files`)

Accepts multiple files and packages them into a bundled ZIP archive (with both raw code and rendered SVG graphics) or a merged multi-page PDF document.

**Request:**
```http
POST /api/v1/files HTTP/1.1
Content-Type: application/json

{
  "files": [
    {
      "name": "server.py",
      "code": "from fastapi import FastAPI\napp = FastAPI()",
      "language": "python"
    },
    {
      "name": "config.yaml",
      "code": "host: 0.0.0.0\nport: 8000",
      "language": "yaml"
    }
  ],
  "format": "zip",
  "theme": "tokyo-night",
  "background": "cosmic-sunset",
  "archive_name": "my-service-code"
}
```

**Output ZIP Contents:**
```text
my-service-code.zip
├── MANIFEST.md
├── source/
│   ├── server.py
│   └── config.yaml
└── snippets/
    ├── server.svg
    └── config.svg
```

---

### 4. Registry Introspection Endpoints

- `GET /api/v1/themes`: Returns available syntax color themes (`tokyo-night`, `one-dark-pro`, `dracula`, `catppuccin`, `nord`, `monokai`, `github-dark`, `github-light`, `synthwave-84`).
- `GET /api/v1/backgrounds`: Returns available wallpaper gradient backgrounds (`cosmic-sunset`, `aurora`, `neon-dusk`, `ember-glow`, `ocean-abyss`, `obsidian`, `transparent`).
- `GET /api/v1/fonts`: Returns available developer fonts (`jetbrains-mono`, `fira-code`, `geist-mono`, `ibm-plex-mono`, `cascadia-code`, `source-code-pro`).
- `GET /api/v1/frames`: Returns available window chrome options (`macos`, `macos-outline`, `macos-monochrome`, `windows`, `terminal`, `minimal`, `none`).
- `GET /api/v1/health`: Returns API health status.

---

## Authors & License

DevPaper is authored and maintained by **Ayush** ([@itsjustayush](https://github.com/itsjustayush)) and the DevPaper Contributors.  
Licensed under the **[MIT License](../LICENSE)**. Copyright (c) 2026 Ayush (@itsjustayush) and DevPaper Contributors.

