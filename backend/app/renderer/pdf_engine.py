"""
DevPaper High-Performance Multi-Page Vector PDF Engine powered by ReportLab.

Renders pixel-perfect, publication-grade code documents matching DevPaper's web interface:
  • Dark canvas sheet (#09090b / zinc-950) with outer elevation border
  • Running header with emerald FileCode icon, bold title, repository badge, language pill, and 'Page X of Y'
  • Floating window container with rounded corners, theme background, border, and soft drop shadow
  • Window chrome with macOS traffic lights (#ff5f56, #ffbd2e, #27c93f), centered filename, and language badge
  • High-contrast code gutter with right-aligned line numbers, diff markers (+/-), and syntax tokens in exact theme colors
  • Running footer with line range indicator, emerald BookOpen icon, and DevPaper Typesetting Studio watermark
"""

import io
import os
import re
from typing import List, Optional, Tuple, Dict, Any

from reportlab.lib.pagesizes import A4, LETTER, A3, landscape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from app.themes import THEMES
from app.renderer.svg_engine import tokenize_code, resolve_language

# ---------------------------------------------------------------------------
# Font Management: TrueType Consolas / Segoe UI with Fallbacks
# ---------------------------------------------------------------------------
MONO_FONT = "Courier"
MONO_FONT_BOLD = "Courier-Bold"
SANS_FONT = "Helvetica"
SANS_FONT_BOLD = "Helvetica-Bold"

def init_fonts():
    global MONO_FONT, MONO_FONT_BOLD, SANS_FONT, SANS_FONT_BOLD
    registered = pdfmetrics.getRegisteredFontNames()
    
    if "DevMono" not in registered:
        for mono_path, bold_path in [
            ("C:/Windows/Fonts/consola.ttf", "C:/Windows/Fonts/consolab.ttf"),
            ("C:/Windows/Fonts/cour.ttf", "C:/Windows/Fonts/courbd.ttf"),
            ("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"),
        ]:
            if os.path.exists(mono_path):
                try:
                    pdfmetrics.registerFont(TTFont("DevMono", mono_path))
                    if os.path.exists(bold_path):
                        pdfmetrics.registerFont(TTFont("DevMono-Bold", bold_path))
                    else:
                        pdfmetrics.registerFont(TTFont("DevMono-Bold", mono_path))
                    MONO_FONT = "DevMono"
                    MONO_FONT_BOLD = "DevMono-Bold"
                    break
                except Exception:
                    pass

    if "DevSans" not in registered:
        for sans_path, bold_path in [
            ("C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/segoeuib.ttf"),
            ("C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/arialbd.ttf"),
            ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
        ]:
            if os.path.exists(sans_path):
                try:
                    pdfmetrics.registerFont(TTFont("DevSans", sans_path))
                    if os.path.exists(bold_path):
                        pdfmetrics.registerFont(TTFont("DevSans-Bold", bold_path))
                    else:
                        pdfmetrics.registerFont(TTFont("DevSans-Bold", sans_path))
                    SANS_FONT = "DevSans"
                    SANS_FONT_BOLD = "DevSans-Bold"
                    break
                except Exception:
                    pass

init_fonts()

# ---------------------------------------------------------------------------
# Paper Size Specifications
# ---------------------------------------------------------------------------
PAGE_SIZE_MAP = {
    "a4": A4,
    "a4-portrait": A4,
    "a4-landscape": landscape(A4),
    "letter": LETTER,
    "letter-portrait": LETTER,
    "letter-landscape": landscape(LETTER),
    "a3": A3,
    "a3-portrait": A3,
    "a3-landscape": landscape(A3),
    "auto": A4,
}

# ---------------------------------------------------------------------------
# Color Parsing & Utilities
# ---------------------------------------------------------------------------
def parse_color(c_val: str, fallback=(0.5, 0.5, 0.5, 1.0)) -> colors.Color:
    if not c_val:
        return colors.Color(*fallback)
    c_val = c_val.strip()
    if c_val.startswith("rgba"):
        m = re.match(r"rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)", c_val)
        if m:
            r = int(m.group(1)) / 255.0
            g = int(m.group(2)) / 255.0
            b = int(m.group(3)) / 255.0
            a = float(m.group(4)) if m.group(4) is not None else 1.0
            return colors.Color(r, g, b, alpha=a)
    c_val = c_val.lstrip("#")
    if len(c_val) == 6:
        r = int(c_val[0:2], 16) / 255.0
        g = int(c_val[2:4], 16) / 255.0
        b = int(c_val[4:6], 16) / 255.0
        return colors.Color(r, g, b, alpha=1.0)
    elif len(c_val) == 8:
        r = int(c_val[0:2], 16) / 255.0
        g = int(c_val[2:4], 16) / 255.0
        b = int(c_val[4:6], 16) / 255.0
        a = int(c_val[6:8], 16) / 255.0
        return colors.Color(r, g, b, alpha=a)
    return colors.Color(*fallback)

def is_light_color(c: colors.Color) -> bool:
    # Perceived luminance formula
    lum = (0.299 * c.red) + (0.587 * c.green) + (0.114 * c.blue)
    return lum > 0.65

# ---------------------------------------------------------------------------
# Vector Icon Drawing Helpers
# ---------------------------------------------------------------------------
def draw_file_code_icon(c: canvas.Canvas, x: float, y: float, size: float = 12.0, color=colors.HexColor("#34d399")):
    """Draws a crisp vector document icon with folded corner and </> code emblem."""
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(colors.Color(color.red, color.green, color.blue, alpha=0.15))
    c.setLineWidth(0.8)
    w = size * 0.82
    h = size
    fold = size * 0.28
    
    p = c.beginPath()
    p.moveTo(x, y)
    p.lineTo(x + w, y)
    p.lineTo(x + w, y + h - fold)
    p.lineTo(x + w - fold, y + h)
    p.lineTo(x, y + h)
    p.close()
    c.drawPath(p, fill=1, stroke=1)
    
    # Fold corner line
    c.line(x + w - fold, y + h, x + w - fold, y + h - fold)
    c.line(x + w - fold, y + h - fold, x + w, y + h - fold)
    
    # </> code symbol
    c.setFont(MONO_FONT, size * 0.42)
    c.setFillColor(color)
    c.drawString(x + 1.2, y + 2.8, "</>")
    c.restoreState()

def draw_book_icon(c: canvas.Canvas, x: float, y: float, size: float = 9.5, color=colors.HexColor("#34d399")):
    """Draws an open book vector emblem for the DevPaper watermark."""
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(colors.Color(color.red, color.green, color.blue, alpha=0.18))
    c.setLineWidth(0.8)
    
    # Left page
    p1 = c.beginPath()
    p1.moveTo(x + size * 0.5, y + 1)
    p1.lineTo(x + 1, y + 2.2)
    p1.lineTo(x + 1, y + size)
    p1.lineTo(x + size * 0.5, y + size - 1.2)
    p1.close()
    c.drawPath(p1, fill=1, stroke=1)
    
    # Right page
    p2 = c.beginPath()
    p2.moveTo(x + size * 0.5, y + 1)
    p2.lineTo(x + size - 1, y + 2.2)
    p2.lineTo(x + size - 1, y + size)
    p2.lineTo(x + size * 0.5, y + size - 1.2)
    p2.close()
    c.drawPath(p2, fill=1, stroke=1)
    c.restoreState()

def draw_terminal_icon(c: canvas.Canvas, x: float, y: float, size: float = 10.0, color=colors.HexColor("#34d399")):
    """Draws a terminal command prompt icon."""
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(colors.Color(color.red, color.green, color.blue, alpha=0.15))
    c.setLineWidth(0.8)
    c.roundRect(x, y, size * 1.1, size, 2, fill=1, stroke=1)
    c.setFont(MONO_FONT_BOLD, size * 0.65)
    c.setFillColor(color)
    c.drawString(x + 2, y + 2.2, ">")
    c.restoreState()

def draw_window_controls(
    c: canvas.Canvas,
    style: str,
    left_x: float,
    center_y: float,
    window_width: float,
    is_light: bool = False,
):
    """Draws window header controls according to frame_style."""
    c.saveState()
    
    if style in ("macos", "macos-filled"):
        # Red
        c.setFillColor(colors.HexColor("#ff5f56"))
        c.setStrokeColor(colors.HexColor("#e0443e"))
        c.setLineWidth(0.5)
        c.circle(left_x + 16, center_y, 4.5, fill=1, stroke=1)
        # Yellow
        c.setFillColor(colors.HexColor("#ffbd2e"))
        c.setStrokeColor(colors.HexColor("#dea123"))
        c.circle(left_x + 29, center_y, 4.5, fill=1, stroke=1)
        # Green
        c.setFillColor(colors.HexColor("#27c93f"))
        c.setStrokeColor(colors.HexColor("#1aab29"))
        c.circle(left_x + 42, center_y, 4.5, fill=1, stroke=1)

    elif style == "macos-outline":
        c.setLineWidth(1.2)
        c.setStrokeColor(colors.HexColor("#ff5f56"))
        c.circle(left_x + 16, center_y, 4.2, fill=0, stroke=1)
        c.setStrokeColor(colors.HexColor("#ffbd2e"))
        c.circle(left_x + 29, center_y, 4.2, fill=0, stroke=1)
        c.setStrokeColor(colors.HexColor("#27c93f"))
        c.circle(left_x + 42, center_y, 4.2, fill=0, stroke=1)

    elif style == "macos-monochrome":
        c.setFillColor(colors.Color(0, 0, 0, alpha=0.25) if is_light else colors.Color(1, 1, 1, alpha=0.22))
        c.circle(left_x + 16, center_y, 4.5, fill=1, stroke=0)
        c.circle(left_x + 29, center_y, 4.5, fill=1, stroke=0)
        c.circle(left_x + 42, center_y, 4.5, fill=1, stroke=0)

    elif style == "terminal":
        draw_terminal_icon(c, left_x + 14, center_y - 5.0, size=10.0, color=colors.HexColor("#34d399"))
        c.setFont(MONO_FONT, 8.0)
        c.setFillColor(colors.Color(0.2, 0.2, 0.2) if is_light else colors.Color(1, 1, 1, alpha=0.55))
        c.drawString(left_x + 29, center_y - 2.8, "bash")

    elif style == "windows":
        right_x = left_x + window_width - 16
        c.setStrokeColor(colors.Color(0, 0, 0, alpha=0.5) if is_light else colors.Color(1, 1, 1, alpha=0.55))
        c.setLineWidth(0.9)
        # Minimize —
        c.line(right_x - 30, center_y - 2, right_x - 22, center_y - 2)
        # Maximize □
        c.rect(right_x - 18, center_y - 4, 7, 7, fill=0, stroke=1)
        # Close ✕
        c.line(right_x - 6, center_y - 3.5, right_x, center_y + 3.5)
        c.line(right_x - 6, center_y + 3.5, right_x, center_y - 3.5)

    c.restoreState()

# ---------------------------------------------------------------------------
# Core Document Generator Function
# ---------------------------------------------------------------------------
def generate_pdf_document(
    code: str,
    language: str = "auto",
    file_name: str = "document.ts",
    theme_id: str = "tokyo-night",
    paper_size_id: str = "a4",
    frame_style: str = "macos",
    font_id: str = "jetbrains-mono",
    background_id: Optional[str] = None,
    watermark: str = "DevPaper Typesetting Studio",
    show_line_numbers: bool = True,
    start_line_number: int = 1,
    doc_repo: Optional[str] = "github.com/DevPaper/devpaper",
    doc_title: Optional[str] = None,
    doc_author: Optional[str] = None,
    highlight_lines: Optional[List[int]] = None,
    orientation: str = "portrait",
    padding: int = 32,
    border_radius: int = 12,
) -> bytes:
    """
    Generates a multi-page vector PDF document matching DevPaper's web PageSheet design.
    """
    if highlight_lines is None:
        highlight_lines = []

    init_fonts()
    buffer = io.BytesIO()

    # Determine Page Dimensions
    dimensions = PAGE_SIZE_MAP.get(paper_size_id.lower(), A4)
    page_width, page_height = dimensions
    if orientation.lower() == "landscape" and page_width < page_height:
        page_width, page_height = page_height, page_width
    elif orientation.lower() == "portrait" and page_width > page_height:
        page_width, page_height = page_height, page_width

    c = canvas.Canvas(buffer, pagesize=(page_width, page_height))
    resolved_lang = resolve_language(file_name, code, language)
    theme = THEMES.get(theme_id, THEMES["tokyo-night"])

    # Sheet and theme colors
    sheet_bg = parse_color("#09090b")
    theme_bg = parse_color(theme["background"])
    is_theme_light = is_light_color(theme_bg)
    theme_border = parse_color(theme.get("border", "rgba(0, 0, 0, 0.12)" if is_theme_light else "rgba(255, 255, 255, 0.08)"))
    line_num_color = parse_color(theme.get("line_number", "#8c959f" if is_theme_light else "#5c6370"))

    # Layout Spacing
    padding_x = float(max(20, min(64, padding)))
    padding_y = float(max(20, min(64, padding)))

    header_height = 22.0
    footer_height = 20.0
    content_width = page_width - (padding_x * 2)

    # Coordinates in ReportLab (bottom-left origin)
    header_top = page_height - padding_y
    header_bottom = header_top - header_height

    footer_bottom = padding_y
    footer_top = footer_bottom + footer_height

    window_top = header_bottom - 10.0
    window_bottom = footer_top + 10.0
    window_height = window_top - window_bottom
    window_width = content_width
    window_left = padding_x

    has_chrome = frame_style != "none"
    chrome_height = 28.0 if has_chrome else 0.0
    chrome_bottom = window_top - chrome_height

    code_top = chrome_bottom - 12.0
    code_bottom = window_bottom + 12.0
    usable_code_height = code_top - code_bottom

    line_height = 14.5
    font_size = 9.0

    raw_lines = code.splitlines()
    tokenized_lines = tokenize_code(code, resolved_lang)
    if not tokenized_lines or len(tokenized_lines) == 0:
        tokenized_lines = [[("", theme.get("foreground", "#c0caf5"))]]

    lines_per_page = max(5, int(usable_code_height / line_height))
    total_pages = max(1, (len(tokenized_lines) + lines_per_page - 1) // lines_per_page)

    # Compute gutter width
    total_line_count = len(tokenized_lines)
    max_line_digits = max(2, len(str(start_line_number + total_line_count)))
    gutter_width = (max_line_digits * 6.5) + 14.0 if show_line_numbers else 0.0
    gutter_right = window_left + gutter_width
    code_start_x = gutter_right + 14.0 if show_line_numbers else window_left + 16.0

    display_title = doc_title or file_name

    for page_num in range(1, total_pages + 1):
        # -------------------------------------------------------------------
        # 1. Outer Dark Sheet Canvas (#09090b) with Outer Border
        # -------------------------------------------------------------------
        c.setFillColor(sheet_bg)
        c.rect(0, 0, page_width, page_height, fill=1, stroke=0)

        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.08))
        c.setLineWidth(1.0)
        c.roundRect(padding_x * 0.5, padding_y * 0.5, page_width - padding_x, page_height - padding_y, 8, fill=0, stroke=1)

        # -------------------------------------------------------------------
        # 2. Running Header (Title, Repo, Language Pill, Page Counter)
        # -------------------------------------------------------------------
        # Left: Emerald FileCode icon + Bold Title
        draw_file_code_icon(c, padding_x, header_bottom + 5, size=12.0, color=colors.HexColor("#34d399"))

        c.setFont(SANS_FONT_BOLD, 9.5)
        c.setFillColor(colors.HexColor("#f4f4f5"))
        c.drawString(padding_x + 16, header_bottom + 6.5, display_title)
        title_width = c.stringWidth(display_title, SANS_FONT_BOLD, 9.5)

        if doc_repo:
            c.setFont(SANS_FONT, 8.0)
            c.setFillColor(colors.Color(1, 1, 1, alpha=0.38))
            c.drawString(padding_x + 16 + title_width + 8, header_bottom + 6.5, doc_repo)

        # Right: Language Pill Badge + Page Counter
        page_str = f"Page {page_num} of {total_pages}"
        c.setFont(SANS_FONT, 8.0)
        c.setFillColor(colors.Color(1, 1, 1, alpha=0.45))
        c.drawRightString(page_width - padding_x, header_bottom + 6.5, page_str)
        page_str_width = c.stringWidth(page_str, SANS_FONT, 8.0)

        lang_str = resolved_lang.upper()
        c.setFont(MONO_FONT_BOLD, 7.0)
        lang_text_width = c.stringWidth(lang_str, MONO_FONT_BOLD, 7.0)
        pill_w = lang_text_width + 12.0
        pill_h = 13.0
        pill_x = page_width - padding_x - page_str_width - 12.0 - pill_w
        pill_y = header_bottom + 4.5

        c.setFillColor(colors.Color(1, 1, 1, alpha=0.06))
        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.12))
        c.setLineWidth(0.6)
        c.roundRect(pill_x, pill_y, pill_w, pill_h, 3, fill=1, stroke=1)

        c.setFillColor(colors.Color(1, 1, 1, alpha=0.55))
        c.drawString(pill_x + 6.0, pill_y + 3.5, lang_str)

        # Header bottom divider line
        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.10))
        c.setLineWidth(0.8)
        c.line(padding_x, header_bottom, page_width - padding_x, header_bottom)

        # -------------------------------------------------------------------
        # 3. Main Window Container with Soft Elevation Shadow
        # -------------------------------------------------------------------
        for offset, alpha in [(3, 0.15), (2, 0.10), (1, 0.05)]:
            c.setFillColor(colors.Color(0, 0, 0, alpha=alpha))
            c.roundRect(window_left - offset, window_bottom - offset, window_width + (offset * 2), window_height + (offset * 2), border_radius + 2, fill=1, stroke=0)

        c.setFillColor(theme_bg)
        c.setStrokeColor(theme_border)
        c.setLineWidth(1.0)
        c.roundRect(window_left, window_bottom, window_width, window_height, border_radius, fill=1, stroke=1)

        # -------------------------------------------------------------------
        # 4. Window Header / Chrome
        # -------------------------------------------------------------------
        if has_chrome:
            # Glass tint clipped inside the top border radius
            c.saveState()
            clip_p = c.beginPath()
            clip_p.roundRect(window_left, window_bottom, window_width, window_height, border_radius)
            c.clipPath(clip_p, stroke=0)

            c.setFillColor(colors.Color(0, 0, 0, alpha=0.03) if is_theme_light else colors.Color(1, 1, 1, alpha=0.035))
            c.rect(window_left, chrome_bottom, window_width, chrome_height, fill=1, stroke=0)
            c.restoreState()

            # Chrome bottom divider line
            c.setStrokeColor(colors.Color(0, 0, 0, alpha=0.08) if is_theme_light else colors.Color(1, 1, 1, alpha=0.08))
            c.setLineWidth(0.8)
            c.line(window_left, chrome_bottom, window_left + window_width, chrome_bottom)

            tl_center_y = window_top - (chrome_height * 0.5)

            # Left controls
            draw_window_controls(
                c=c,
                style=frame_style,
                left_x=window_left,
                center_y=tl_center_y,
                window_width=window_width,
                is_light=is_theme_light,
            )

            # Center: Filename
            c.setFont(MONO_FONT, 8.5)
            c.setFillColor(colors.Color(0.2, 0.2, 0.2, alpha=0.8) if is_theme_light else colors.Color(1, 1, 1, alpha=0.72))
            center_x = window_left + (window_width * 0.5)
            c.drawCentredString(center_x, tl_center_y - 3.0, file_name)

            # Right: Language badge inside window chrome
            c.setFont(MONO_FONT, 7.5)
            cap_lang = resolved_lang.capitalize()
            badge_w = c.stringWidth(cap_lang, MONO_FONT, 7.5) + 12.0
            badge_h = 13.0
            badge_x = window_left + window_width - 14.0 - badge_w
            badge_y = tl_center_y - (badge_h * 0.5)

            c.setFillColor(colors.Color(0, 0, 0, alpha=0.05) if is_theme_light else colors.Color(1, 1, 1, alpha=0.08))
            c.setStrokeColor(colors.Color(0, 0, 0, alpha=0.10) if is_theme_light else colors.Color(1, 1, 1, alpha=0.10))
            c.roundRect(badge_x, badge_y, badge_w, badge_h, 3.5, fill=1, stroke=1)
            c.setFillColor(colors.Color(0.25, 0.25, 0.25) if is_theme_light else colors.Color(1, 1, 1, alpha=0.60))
            c.drawString(badge_x + 6.0, badge_y + 3.2, cap_lang)

        # -------------------------------------------------------------------
        # 5. Code Lines Stream
        # -------------------------------------------------------------------
        start_idx = (page_num - 1) * lines_per_page
        end_idx = min(start_idx + lines_per_page, len(tokenized_lines))

        curr_y = code_top - font_size
        c.setFont(MONO_FONT, font_size)

        for idx in range(start_idx, end_idx):
            line_tokens = tokenized_lines[idx]
            raw_text = raw_lines[idx] if idx < len(raw_lines) else ""
            actual_line_num = start_line_number + idx
            line_num_str = str(actual_line_num)

            # Detect Diff
            is_diff_add = raw_text.startswith("+") and not raw_text.startswith("+++")
            is_diff_remove = raw_text.startswith("-") and not raw_text.startswith("---")
            is_highlighted = actual_line_num in highlight_lines

            # Highlight / Diff Background Row
            if is_diff_add:
                c.setFillColor(colors.Color(0.06, 0.72, 0.5, alpha=0.12))
                c.rect(window_left + 1, curr_y - 3.0, window_width - 2, line_height, fill=1, stroke=0)
            elif is_diff_remove:
                c.setFillColor(colors.Color(0.95, 0.25, 0.35, alpha=0.12))
                c.rect(window_left + 1, curr_y - 3.0, window_width - 2, line_height, fill=1, stroke=0)
            elif is_highlighted:
                c.setFillColor(colors.Color(1, 1, 1, alpha=0.07))
                c.rect(window_left + 1, curr_y - 3.0, window_width - 2, line_height, fill=1, stroke=0)
                # Emerald vertical indicator strip on left
                c.setFillColor(colors.HexColor("#34d399"))
                c.rect(window_left + 1, curr_y - 3.0, 2.5, line_height, fill=1, stroke=0)

            # Line number in gutter
            if show_line_numbers:
                c.setFont(MONO_FONT, font_size)
                c.setFillColor(line_num_color)
                c.drawRightString(gutter_right, curr_y, line_num_str)

                # Diff sign in gutter column
                if is_diff_add:
                    c.setFillColor(colors.HexColor("#34d399"))
                    c.drawString(gutter_right + 4.0, curr_y, "+")
                elif is_diff_remove:
                    c.setFillColor(colors.HexColor("#f43f5e"))
                    c.drawString(gutter_right + 4.0, curr_y, "-")

            # Draw code tokens
            curr_x = code_start_x
            for content, hex_c in line_tokens:
                content = content.replace("\t", "  ")
                if content:
                    c.setFillColor(parse_color(hex_c))
                    c.drawString(curr_x, curr_y, content)
                    curr_x += c.stringWidth(content, MONO_FONT, font_size)

            curr_y -= line_height

        # -------------------------------------------------------------------
        # 6. Running Footer (Line Range, Watermark with Emerald Book)
        # -------------------------------------------------------------------
        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.08))
        c.setLineWidth(0.8)
        c.line(padding_x, footer_top, page_width - padding_x, footer_top)

        # Left: Line range or author
        c.setFont(MONO_FONT, 7.5)
        c.setFillColor(colors.Color(1, 1, 1, alpha=0.32))
        footer_label = f"Author: {doc_author}" if doc_author else f"Lines {start_line_number + start_idx}–{start_line_number + end_idx - 1}"
        c.drawString(padding_x, footer_bottom + 5.0, footer_label)

        # Right: Watermark with Emerald Book icon
        if watermark:
            c.setFont(SANS_FONT, 7.5)
            wm_width = c.stringWidth(watermark, SANS_FONT, 7.5)
            wm_x = page_width - padding_x - wm_width
            draw_book_icon(c, wm_x - 14.0, footer_bottom + 4.0, size=9.5, color=colors.HexColor("#34d399"))
            c.setFillColor(colors.Color(1, 1, 1, alpha=0.45))
            c.drawString(wm_x, footer_bottom + 5.0, watermark)

        c.showPage()

    c.save()
    buffer.seek(0)
    return buffer.getvalue()
