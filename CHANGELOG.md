# Changelog

All notable changes to **DevPaper** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- GitHub CI/CD workflows for linting, testing, and automated tag releases.
- Community governance templates (Issue forms, PR template, CODEOWNERS, Dependabot).
- Formal Citation metadata (`CITATION.cff`) and Adopters directory (`ADOPTERS.md`).

---

## [1.0.0] - 2026-11-13

### Added
- **Unified Content-Aware Studio**: Seamless live code editor with auto language detection, tab size, line wrapping, line numbering, diff markers (`+` / `-`), and line highlighting.
- **Document-Grade Pagination Engine**: Mathematical pagination core (`src/core/paginator.ts`) capable of splitting arbitrarily long code across sequential physical sheets (A4, Letter, A3, 16:9 Slides) with continuous line numbers and running headers/footers.
- **Export Pipeline**: High-performance multi-format exporter:
  - Instant 2x Retina PNG copy to clipboard via Web Clipboard API.
  - Lossless vector SVG download.
  - Merged multi-page vector PDF matching exact physical paper dimensions.
  - Bundled ZIP archives containing numbered high-res page images.
- **Declarative Plugin Registries**: Modular registries in `src/registries/` for themes, fonts, frames, and paper sizes with runtime Zod/TypeScript validation.
- **Headless Python FastAPI Backend**:
  - `POST /api/v1/snippet`: Generates standalone vector SVG, PDF, or HTML snippets with zero authentication.
  - `GET /api/v1/snippet`: Direct image query URL for instant embedding in Markdown READMEs and website HTML (`<img src="...">`).
  - `POST /api/v1/files`: Batch renders entire project folders into a downloadable ZIP archive with `source/` code, `snippets/` SVGs, and an auto-generated `MANIFEST.md`.
  - Pure vector SVG rendering engine powered by Pygments (100+ languages).
  - Native multi-page vector PDF engine powered by ReportLab.
- **AI Agent Hub & Developer Portal**:
  - Full interactive playground and documentation at `/agent`.
  - Pre-made, copy-pasteable system prompt for Cursor (`.cursorrules`), Claude Code (`CLAUDE.md`), Windsurf, and Antigravity.
  - Token-efficient specification at `/ai.txt` and machine schema at `/agent.json`.
- **Meta Astryx Design System**: Clean, distraction-free floating dock layout with dark zinc aesthetics, zero AI bloat, and authentic GitHub DevPaper branding.

### Changed
- Unified the previously separate Canvas and CodePaper tabs into a content-aware studio where code editing is primary and page sizing is configured dynamically during export.
- Optimized multi-page canvas rendering to use chunked event-loop yielding (`setTimeout(0)`) and native `HTMLCanvasElement.toBlob()` to eliminate browser thread lockups during large document exports.

### Performance
- Export rendering speed for 15-page documents reduced from >15 seconds down to ~800ms through parallel rasterization and native JPEG DCT embedding in jsPDF.

---

[Unreleased]: https://github.com/DevPaper/devpaper/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/DevPaper/devpaper/releases/tag/v1.0.0

