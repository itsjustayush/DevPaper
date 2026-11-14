"""
DevPaper Core API Service
Ultra-fast, zero-auth code typesetting and snippet generation engine for humans and AI agents.
"""

import os
from pathlib import Path
from typing import Optional, Tuple
from fastapi import FastAPI, Query, HTTPException, Response, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from app.models import SnippetRequest, MultiFileRequest, SourceFile
from app.themes import THEMES, BACKGROUNDS, FONTS
from app.renderer.svg_engine import render_svg_snippet, resolve_language
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

def resolve_code_source(
    code: Optional[str] = None,
    file_path: Optional[str] = None,
    file_name: Optional[str] = None,
    language: Optional[str] = "auto",
) -> Tuple[str, str, str]:
    """
    Resolves source code content, file name, and programming language.
    Supports either direct code string, explicit file_path, or code pointing to an existing file.
    """
    target_path = None
    resolved_code = None

    # Option A: Explicit file_path provided
    if file_path and file_path.strip():
        p = Path(file_path.strip())
        if p.is_file():
            target_path = p
        else:
            raise HTTPException(status_code=404, detail=f"File not found: '{file_path}'")

    # Option B: code is given, but might be a path to a file on disk (e.g. "main.py", "src/app.ts")
    elif code and isinstance(code, str):
        stripped = code.strip()
        # If it doesn't contain newlines, is reasonably short, and exists as a file
        if "\n" not in stripped and len(stripped) < 512 and Path(stripped).is_file():
            target_path = Path(stripped)
        else:
            resolved_code = code

    # If target_path was identified, read content from disk
    if target_path:
        try:
            resolved_code = target_path.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to read file '{target_path}': {str(e)}")
        
        if not file_name or file_name == "snippet.ts" or file_name == "snippet.txt":
            file_name = target_path.name

    if not resolved_code or not resolved_code.strip():
        raise HTTPException(status_code=400, detail="Source code or file content cannot be empty.")

    resolved_filename = file_name or "snippet.txt"
    resolved_lang = resolve_language(resolved_filename, resolved_code, language or "auto")

    return resolved_code, resolved_filename, resolved_lang


@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "DevPaper API",
        "version": "1.0.0",
        "capabilities": ["svg", "pdf", "zip", "file_path", "multipart-upload", "auto-detect"],
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
    Generate a formatted code snippet image or document from source code or file path.
    Accepts raw code string or a local file path ('file_path' or 'code').
    Supports SVG, PDF, and HTML output formats.
    """
    code_text, clean_filename, resolved_lang = resolve_code_source(
        code=req.code,
        file_path=req.file_path,
        file_name=req.file_name,
        language=req.language,
    )

    base_name = clean_filename.rsplit(".", 1)[0] if "." in clean_filename else clean_filename

    # Format 1: Multi-Page or Vector PDF Document
    if req.format and req.format.lower() == "pdf":
        pdf_bytes = generate_pdf_document(
            code=code_text,
            language=resolved_lang,
            file_name=clean_filename,
            theme_id=req.theme or "tokyo-night",
            paper_size_id=req.paper_size or "a4",
            frame_style=req.frame or "macos",
            font_id=req.font or "jetbrains-mono",
            background_id=req.background,
            watermark=req.watermark or "DevPaper Typesetting Studio",
            show_line_numbers=req.show_line_numbers if req.show_line_numbers is not None else True,
            start_line_number=req.start_line_number or 1,
            highlight_lines=req.highlight_lines or [],
            border_radius=req.border_radius or 12,
            padding=req.padding or 32,
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{base_name}.pdf"'},
        )

    # Format 2: Vector SVG (Default & Recommended for Web / Readmes)
    svg_content = render_svg_snippet(
        code=code_text,
        language=resolved_lang,
        file_name=clean_filename,
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

    if req.format and req.format.lower() == "html":
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
            "Content-Disposition": f'attachment; filename="{base_name}.svg"',
            "Cache-Control": "public, max-age=86400",
        },
    )

@app.post("/api/v1/snippet/upload")
async def upload_file_snippet(
    file: UploadFile = File(..., description="File to upload and typeset directly"),
    theme: str = Form("tokyo-night"),
    background: str = Form("cosmic-sunset"),
    font: str = Form("jetbrains-mono"),
    frame: str = Form("macos"),
    format: str = Form("svg"),
    paper_size: str = Form("a4"),
    show_line_numbers: bool = Form(True),
):
    """
    Direct file upload endpoint for curl, Python requests, or HTML forms.
    Upload any .py, .ts, .html, .rs, .go file without copying/pasting.
    """
    content_bytes = await file.read()
    code_text = content_bytes.decode("utf-8", errors="replace")
    file_name = file.filename or "uploaded_code.txt"
    resolved_lang = resolve_language(file_name, code_text, "auto")
    base_name = file_name.rsplit(".", 1)[0] if "." in file_name else file_name

    if format.lower() == "pdf":
        pdf_bytes = generate_pdf_document(
            code=code_text,
            language=resolved_lang,
            file_name=file_name,
            theme_id=theme,
            paper_size_id=paper_size,
            frame_style=frame,
            font_id=font,
            background_id=background,
            watermark="DevPaper Typesetting Studio",
            show_line_numbers=show_line_numbers,
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{base_name}.pdf"'},
        )

    svg_content = render_svg_snippet(
        code=code_text,
        language=resolved_lang,
        file_name=file_name,
        theme_id=theme,
        background_id=background,
        font_id=font,
        frame_style=frame,
        show_line_numbers=show_line_numbers,
    )

    return Response(
        content=svg_content,
        media_type="image/svg+xml",
        headers={
            "Content-Disposition": f'attachment; filename="{base_name}.svg"',
            "Cache-Control": "public, max-age=86400",
        },
    )

@app.get("/api/v1/snippet")
async def get_snippet_image(
    code: str = Query(..., description="Source code text OR local file name/path to typeset"),
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
    code_text, resolved_name, resolved_lang = resolve_code_source(
        code=code,
        file_path=None,
        file_name=name,
        language=lang,
    )

    svg_content = render_svg_snippet(
        code=code_text,
        language=resolved_lang,
        file_name=resolved_name,
        theme_id=theme,
        background_id=bg,
        show_line_numbers=lines,
    )
    return Response(
        content=svg_content,
        media_type="image/svg+xml",
        headers={
            "Content-Disposition": f'inline; filename="{resolved_name}.svg"',
            "Cache-Control": "public, max-age=86400",
        },
    )

@app.post("/api/v1/files")
async def create_multi_file_bundle(req: MultiFileRequest):
    """
    Batch process multiple source files or paths into a bundled ZIP archive or multi-page PDF document.
    """
    if not req.files:
        raise HTTPException(status_code=400, detail="Files list cannot be empty.")

    archive_name = req.archive_name or "devpaper-bundle"

    # Resolve all files (either path on disk or code text)
    resolved_files: list[SourceFile] = []
    for f in req.files:
        code_text, resolved_name, resolved_lang = resolve_code_source(
            code=f.code,
            file_path=f.path,
            file_name=f.name,
            language=f.language or "auto",
        )
        resolved_files.append(
            SourceFile(
                name=resolved_name,
                code=code_text,
                language=resolved_lang,
            )
        )

    if req.format and req.format.lower() == "pdf":
        combined_code = ""
        for f in resolved_files:
            combined_code += f"// ==================== {f.name} ====================\n\n{f.code}\n\n"

        pdf_bytes = generate_pdf_document(
            code=combined_code,
            language="auto",
            file_name=archive_name,
            theme_id=req.theme or "tokyo-night",
            paper_size_id=req.paper_size or "a4",
            frame_style=req.frame or "macos",
            font_id=req.font or "jetbrains-mono",
            background_id=req.background,
            watermark=req.watermark or "DevPaper Typesetting Studio",
            show_line_numbers=req.show_line_numbers if req.show_line_numbers is not None else True,
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{archive_name}.pdf"'},
        )

    # Default: Bundled ZIP Archive
    zip_bytes = generate_zip_archive(
        files=resolved_files,
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
