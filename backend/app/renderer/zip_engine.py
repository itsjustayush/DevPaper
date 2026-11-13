"""
High-Performance Sequential ZIP Archive Generator
Packages code snippets, vector SVGs, and metadata into structured archives.
"""

import io
import zipfile
from typing import List
from app.models import SourceFile
from app.renderer.svg_engine import render_svg_snippet

def generate_zip_archive(
    files: List[SourceFile],
    theme: str = "tokyo-night",
    background: str = "cosmic-sunset",
    font: str = "jetbrains-mono",
    frame: str = "macos",
    show_line_numbers: bool = True,
    watermark: str = "DevPaper Studio",
) -> bytes:
    """
    Creates an in-memory zip archive containing both source code and rendered vector SVG files.
    """
    buffer = io.BytesIO()
    
    with zipfile.ZipFile(buffer, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        # 1. Add README manifest
        manifest = f"""# DevPaper Typeset Archive

Generated automatically by DevPaper Typesetting API.
Theme: {theme}
Total Files: {len(files)}

Included Files:
"""
        for idx, f in enumerate(files):
            manifest += f"- {idx + 1:02d}_{f.name} (Source & Rendered SVG)\n"
            
        zf.writestr("MANIFEST.md", manifest)
        
        # 2. Add each file and its rendered SVG
        for idx, f in enumerate(files):
            prefix = f"{idx + 1:02d}_"
            clean_name = f.name.replace("/", "_").replace("\\", "_")
            base_name = clean_name.rsplit(".", 1)[0] if "." in clean_name else clean_name
            
            # Save raw source code
            zf.writestr(f"source/{clean_name}", f.code)
            
            # Render and save beautiful SVG
            svg_content = render_svg_snippet(
                code=f.code,
                language=f.language or "auto",
                file_name=f.name,
                theme_id=theme,
                background_id=background,
                font_id=font,
                frame_style=frame,
                show_line_numbers=show_line_numbers,
                watermark=watermark,
            )
            zf.writestr(f"snippets/{base_name}.svg", svg_content)
            
    buffer.seek(0)
    return buffer.getvalue()

