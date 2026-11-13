"""
DevPaper Core API Service
Ultra-fast, zero-auth code typesetting and snippet generation engine for humans and AI agents.
"""

from fastapi import FastAPI, Query, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse

from app.models import SnippetRequest, MultiFileRequest
from app.themes import THEMES, BACKGROUNDS, FONTS
from app.renderer.svg_engine import render_svg_snippet
from app.renderer.pdf_engine import generate_pdf_document
from app.renderer.zip_engine import generate_zip_archive

app = FastAPI(
    title="DevPaper Typesetting API",
    description="Zero-auth, high-performance code visualization and document engine for humans and AI agents.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable permissive CORS for all agents, browsers, and CLI tools
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "DevPaper API",
        "version": "1.0.0",
        "capabilities": ["svg", "pdf", "zip", "multi-page", "multi-file", "auto-detect"],
    }

@app.get("/api/v1/themes")
async def list_themes():
    return {
        "themes": [
            {"id": k, "name": v["name"], "background": v["background"], "accent": v["accent"]}
            for k, v in THEMES.items()
        ]
    }

@app.get("/api/v1/backgrounds")
async def list_backgrounds():
    return {
        "backgrounds": [
            {"id": k, "name": v["name"], "gradient": v["gradient"]}
            for k, v in BACKGROUNDS.items()
        ]
    }

@app.get("/api/v1/fonts")
async def list_fonts():
    return {
        "fonts": [
            {"id": k, "fontFamily": v}
            for k, v in FONTS.items()
        ]
    }

@app.get("/api/v1/frames")
async def list_frames():
    return {
        "frames": [
            {"id": "macos", "name": "macOS Traffic Lights"},
            {"id": "macos-outline", "name": "macOS Outline"},
            {"id": "macos-monochrome", "name": "macOS Monochrome"},
            {"id": "windows", "name": "Windows 11 Controls"},
            {"id": "terminal", "name": "Terminal Header ($ bash)"},
            {"id": "minimal", "name": "Minimal Borderless"},
            {"id": "none", "name": "Raw Code Canvas"},
        ]
    }

@app.post("/api/v1/snippet")
async def create_snippet(req: SnippetRequest):
    """
    Generate a formatted code snippet image or document from source code.
    Supports SVG, PDF, and HTML output formats.
    """
    if not req.code or not req.code.strip():
        raise HTTPException(status_code=400, detail="Code string cannot be empty.")

    clean_filename = req.file_name.replace("/", "_").replace("\\", "_")
    base_name = clean_filename.rsplit(".", 1)[0] if "." in clean_filename else clean_filename

    # Format 1: Multi-Page or Vector PDF Document
    if req.format.lower() == "pdf":
        pdf_bytes = generate_pdf_document(
            code=req.code,
            language=req.language or "auto",
            file_name=req.file_name,
            theme_id=req.theme or "tokyo-night",
            paper_size_id=req.paper_size or "a4",
            watermark=req.watermark or "DevPaper Studio",
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{base_name}.pdf"'},
        )

    # Format 2: Vector SVG (Default & Recommended for Web / Readmes)
    svg_content = render_svg_snippet(
        code=req.code,
        language=req.language or "auto",
        file_name=req.file_name,
        theme_id=req.theme or "tokyo-night",
        background_id=req.background or "cosmic-sunset",
        font_id=req.font or "jetbrains-mono",
        frame_style=req.frame or "macos",
        show_line_numbers=req.show_line_numbers if req.show_line_numbers is not None else True,
        start_line_number=req.start_line_number or 1,
        padding=req.padding or 48,
        border_radius=req.border_radius or 16,
        watermark=req.watermark or "DevPaper",
        highlight_lines=req.highlight_lines or [],
    )

    if req.format.lower() == "html":
        html_page = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{clean_filename} — DevPaper</title>
  <style>body {{ margin: 0; background: #090a0f; display: flex; align-items: center; justify-content: center; min-height: 100vh; }}</style>
</head>
<body>
  {svg_content}
</body>
</html>"""
        return HTMLResponse(content=html_page)

    return Response(
        content=svg_content,
        media_type="image/svg+xml",
        headers={
            "Content-Disposition": f'inline; filename="{base_name}.svg"',
            "Cache-Control": "public, max-age=86400",
        },
    )

@app.get("/api/v1/snippet")
async def get_snippet_image(
    code: str = Query(..., description="Source code text to typeset"),
    lang: str = Query("auto", description="Programming language"),
    name: str = Query("snippet.ts", description="File name"),
    theme: str = Query("tokyo-night", description="Theme ID"),
    bg: str = Query("cosmic-sunset", description="Background preset ID"),
    lines: bool = Query(True, description="Show line numbers"),
):
    """
    Direct URL image endpoint for READMEs, blogs, and websites.
    Usage: <img src="https://api.devpaper.dev/api/v1/snippet?code=...&lang=python" />
    """
    svg_content = render_svg_snippet(
        code=code,
        language=lang,
        file_name=name,
        theme_id=theme,
        background_id=bg,
        show_line_numbers=lines,
    )
    return Response(
        content=svg_content,
        media_type="image/svg+xml",
        headers={
            "Content-Disposition": f'inline; filename="{name}.svg"',
            "Cache-Control": "public, max-age=86400",
        },
    )

@app.post("/api/v1/files")
async def create_multi_file_bundle(req: MultiFileRequest):
    """
    Batch process multiple source files into a bundled ZIP archive or multi-page PDF document.
    """
    if not req.files:
        raise HTTPException(status_code=400, detail="Files list cannot be empty.")

    archive_name = req.archive_name or "devpaper-bundle"

    if req.format.lower() == "pdf":
        # Combine all files into a continuous typeset PDF
        combined_code = ""
        for f in req.files:
            combined_code += f"// ==================== {f.name} ====================\n\n{f.code}\n\n"

        pdf_bytes = generate_pdf_document(
            code=combined_code,
            language="auto",
            file_name=archive_name,
            theme_id=req.theme or "tokyo-night",
            paper_size_id=req.paper_size or "a4",
            watermark=req.watermark or "DevPaper Studio",
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{archive_name}.pdf"'},
        )

    # Default: Bundled ZIP Archive
    zip_bytes = generate_zip_archive(
        files=req.files,
        theme=req.theme or "tokyo-night",
        background=req.background or "cosmic-sunset",
        font=req.font or "jetbrains-mono",
        frame=req.frame or "macos",
        show_line_numbers=req.show_line_numbers if req.show_line_numbers is not None else True,
        watermark=req.watermark or "DevPaper Studio",
    )

    return Response(
        content=zip_bytes,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{archive_name}.zip"'},
    )

