"""
High-Performance Multi-Page Vector PDF Engine powered by ReportLab
"""

import io
from typing import List, Optional
from reportlab.lib.pagesizes import A4, LETTER, A3, landscape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from app.themes import THEMES
from app.renderer.svg_engine import tokenize_code, resolve_language

PAGE_SIZE_MAP = {
    "a4": A4,
    "letter": LETTER,
    "a3": A3,
    "auto": A4,
}

def hex_to_color(hex_str: str) -> colors.Color:
    hex_str = hex_str.lstrip("#")
    if len(hex_str) == 6:
        r, g, b = tuple(int(hex_str[i:i+2], 16) / 255.0 for i in (0, 2, 4))
        return colors.Color(r, g, b)
    return colors.Color(0.2, 0.2, 0.2)

def generate_pdf_document(
    code: str,
    language: str = "auto",
    file_name: str = "document.ts",
    theme_id: str = "tokyo-night",
    paper_size_id: str = "a4",
    watermark: str = "DevPaper Typesetting Studio",
) -> bytes:
    """
    Generates a multi-page PDF document with continuous line numbering and headers/footers.
    """
    buffer = io.BytesIO()
    page_dimensions = PAGE_SIZE_MAP.get(paper_size_id.lower(), A4)
    page_width, page_height = page_dimensions
    
    c = canvas.Canvas(buffer, pagesize=page_dimensions)
    resolved_lang = resolve_language(file_name, code, language)
    theme = THEMES.get(theme_id, THEMES["tokyo-night"])
    
    bg_color = hex_to_color(theme["background"])
    fg_color = hex_to_color(theme["foreground"])
    line_num_color = hex_to_color(theme["line_number"])
    accent_color = hex_to_color(theme["accent"])

    lines = tokenize_code(code, resolved_lang)
    
    # Page Layout Constants
    margin_left = 40
    margin_right = 40
    margin_top = 45
    margin_bottom = 40
    
    line_height = 14
    font_size = 9
    
    usable_height = page_height - margin_top - margin_bottom - 40 # reserved for header & footer
    lines_per_page = max(10, int(usable_height / line_height))
    
    total_pages = max(1, (len(lines) + lines_per_page - 1) // lines_per_page)
    
    for page_num in range(1, total_pages + 1):
        # Draw Page Background
        c.setFillColor(bg_color)
        c.rect(0, 0, page_width, page_height, fill=1, stroke=0)
        
        # Running Header
        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.1))
        c.setLineWidth(0.8)
        c.line(margin_left, page_height - margin_top, page_width - margin_right, page_height - margin_top)
        
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(colors.Color(0.9, 0.9, 0.9))
        c.drawString(margin_left, page_height - margin_top + 8, file_name)
        
        c.setFont("Helvetica", 8)
        c.setFillColor(colors.Color(0.6, 0.6, 0.6))
        c.drawRightString(page_width - margin_right, page_height - margin_top + 8, f"{resolved_lang.upper()}  •  Page {page_num} of {total_pages}")
        
        # Code Lines
        start_idx = (page_num - 1) * lines_per_page
        end_idx = min(start_idx + lines_per_page, len(lines))
        
        current_y = page_height - margin_top - 20
        c.setFont("Courier", font_size)
        
        for idx in range(start_idx, end_idx):
            line = lines[idx]
            line_number_str = str(idx + 1)
            
            # Draw line number
            c.setFillColor(line_num_color)
            c.drawRightString(margin_left + 24, current_y, line_number_str)
            
            # Draw code tokens
            x_pos = margin_left + 36
            for content, hex_col in line:
                c.setFillColor(hex_to_color(hex_col))
                c.drawString(x_pos, current_y, content)
                x_pos += c.stringWidth(content, "Courier", font_size)
                
            current_y -= line_height
            
        # Running Footer
        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.08))
        c.line(margin_left, margin_bottom + 14, page_width - margin_right, margin_bottom + 14)
        
        c.setFont("Helvetica", 8)
        c.setFillColor(colors.Color(0.4, 0.4, 0.4))
        c.drawString(margin_left, margin_bottom + 2, f"Lines {start_idx + 1}–{end_idx}")
        
        if watermark:
            c.drawRightString(page_width - margin_right, margin_bottom + 2, watermark)
            
        c.showPage()
        
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

