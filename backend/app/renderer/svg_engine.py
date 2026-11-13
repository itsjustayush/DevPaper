"""
High-Performance Vector SVG Code Renderer
Produces pixel-perfect, standalone SVG snippets inspired by Ray.so and DevPaper.
"""

import html
import re
from typing import List, Optional, Tuple
from pygments import lex
from pygments.lexers import get_lexer_by_name, guess_lexer
from pygments.token import Token
from app.themes import THEMES, BACKGROUNDS, FONTS

# Extension to language map for robust auto-detection
EXT_MAP = {
    "py": "python",
    "ts": "typescript",
    "tsx": "typescript",
    "js": "javascript",
    "jsx": "javascript",
    "rs": "rust",
    "go": "go",
    "c": "c",
    "cpp": "cpp",
    "h": "c",
    "hpp": "cpp",
    "html": "html",
    "css": "css",
    "json": "json",
    "yaml": "yaml",
    "yml": "yaml",
    "sql": "sql",
    "sh": "bash",
    "bash": "bash",
    "md": "markdown",
    "java": "java",
    "kt": "kotlin",
    "swift": "swift",
    "php": "php",
    "rb": "ruby",
    "dockerfile": "docker",
}

TOKEN_COLOR_FALLBACKS = {
    Token.Keyword: "#bb9af7",
    Token.Keyword.Constant: "#ff9e64",
    Token.Keyword.Declaration: "#7aa2f7",
    Token.Keyword.Namespace: "#f7768e",
    Token.Name: "#c0caf5",
    Token.Name.Function: "#7aa2f7",
    Token.Name.Class: "#e0af68",
    Token.Name.Decorator: "#bb9af7",
    Token.Name.Builtin: "#2ac3de",
    Token.Literal.String: "#9ece6a",
    Token.Literal.String.Doc: "#565f89",
    Token.Literal.Number: "#ff9e64",
    Token.Operator: "#89ddff",
    Token.Punctuation: "#9abdf5",
    Token.Comment: "#565f89",
    Token.Generic.Deleted: "#f7768e",
    Token.Generic.Inserted: "#73daca",
}

def resolve_language(file_name: Optional[str], code: str, language: Optional[str]) -> str:
    if language and language.lower() != "auto":
        return language.lower()
    
    if file_name and "." in file_name:
        ext = file_name.split(".")[-1].lower()
        if ext in EXT_MAP:
            return EXT_MAP[ext]
    
    try:
        lexer = guess_lexer(code)
        if lexer.aliases:
            return lexer.aliases[0]
    except Exception:
        pass
    
    return "python"

def tokenize_code(code: str, language: str) -> List[List[Tuple[str, str]]]:
    """
    Tokenizes code lines into (content, color) tuples.
    """
    try:
        lexer = get_lexer_by_name(language, stripnl=False)
    except Exception:
        try:
            lexer = guess_lexer(code)
        except Exception:
            lexer = get_lexer_by_name("text", stripnl=False)

    lines: List[List[Tuple[str, str]]] = [[]]
    
    for token_type, value in lex(code, lexer):
        # Find closest matching color
        color = "#a9b1d6"
        t = token_type
        while t:
            if t in TOKEN_COLOR_FALLBACKS:
                color = TOKEN_COLOR_FALLBACKS[t]
                break
            t = t.parent

        # Split across newlines
        parts = value.split("\n")
        for i, part in enumerate(parts):
            if i > 0:
                lines.append([])
            if part:
                lines[-1].append((part, color))
                
    return lines

def render_svg_snippet(
    code: str,
    language: str = "auto",
    file_name: str = "snippet.ts",
    theme_id: str = "tokyo-night",
    background_id: str = "cosmic-sunset",
    font_id: str = "jetbrains-mono",
    frame_style: str = "macos",
    show_line_numbers: bool = True,
    start_line_number: int = 1,
    padding: int = 48,
    border_radius: int = 16,
    watermark: str = "DevPaper",
    highlight_lines: Optional[List[int]] = None,
) -> str:
    """
    Renders pure vector SVG code snippet.
    """
    if highlight_lines is None:
        highlight_lines = []

    resolved_lang = resolve_language(file_name, code, language)
    theme = THEMES.get(theme_id, THEMES["tokyo-night"])
    bg = BACKGROUNDS.get(background_id, BACKGROUNDS["cosmic-sunset"])
    font_family = FONTS.get(font_id, FONTS["jetbrains-mono"])

    tokenized_lines = tokenize_code(code, resolved_lang)
    line_count = len(tokenized_lines)

    # Dimensions
    font_size = 14
    line_height = 22
    header_height = 42 if frame_style != "none" else 16
    footer_height = 28 if watermark else 12

    # Measure maximum line width
    max_line_chars = 0
    for l in tokenized_lines:
        line_chars = sum(len(text) for text, _ in l)
        if line_chars > max_line_chars:
            max_line_chars = line_chars

    char_width = 8.5
    gutter_width = 48 if show_line_numbers else 20
    content_width = max(max_line_chars * char_width, 360)
    window_width = int(content_width + gutter_width + 40)
    window_height = int(header_height + (line_count * line_height) + footer_height)

    total_width = int(window_width + (padding * 2))
    total_height = int(window_height + (padding * 2))

    # SVG Construction
    svg_parts = []
    svg_parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_width} {total_height}" width="{total_width}" height="{total_height}">')
    
    # Defs: Gradients and drop shadow filter
    svg_parts.append('  <defs>')
    svg_parts.append('    <filter id="devpaper-shadow" x="-10%" y="-10%" width="130%" height="130%">')
    svg_parts.append('      <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#000000" flood-opacity="0.55"/>')
    svg_parts.append('      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.3"/>')
    svg_parts.append('    </filter>')

    # Background gradient
    if bg["svg_stops"]:
        svg_parts.append('    <linearGradient id="devpaper-bg" x1="0%" y1="0%" x2="100%" y2="100%">')
        for stop_color, stop_offset in bg["svg_stops"]:
            svg_parts.append(f'      <stop offset="{stop_offset}" stop-color="{stop_color}"/>')
        svg_parts.append('    </linearGradient>')
    svg_parts.append('  </defs>')

    # Outer canvas background
    if background_id != "transparent":
        bg_fill = 'url(#devpaper-bg)' if bg["svg_stops"] else bg["gradient"]
        svg_parts.append(f'  <rect width="{total_width}" height="{total_height}" rx="24" fill="{bg_fill}"/>')

    # Window container with drop shadow
    win_x = padding
    win_y = padding
    svg_parts.append(f'  <g filter="url(#devpaper-shadow)">')
    svg_parts.append(f'    <rect x="{win_x}" y="{win_y}" width="{window_width}" height="{window_height}" rx="{border_radius}" fill="{theme["background"]}" stroke="{theme["border"]}" stroke-width="1"/>')
    svg_parts.append(f'  </g>')

    # Window Header Chrome
    if frame_style != "none":
        # Header background divider
        svg_parts.append(f'  <path d="M {win_x} {win_y + header_height} L {win_x + window_width} {win_y + header_height}" stroke="{theme["border"]}" stroke-width="1"/>')

        if frame_style in ("macos", "macos-outline", "macos-monochrome"):
            t_colors = theme["traffic_lights"] if frame_style == "macos" else (["#666666", "#666666", "#666666"] if frame_style == "macos-monochrome" else ["none", "none", "none"])
            stroke_attr = f'stroke="{theme["traffic_lights"][0]}" stroke-width="1.5"' if frame_style == "macos-outline" else ""
            
            svg_parts.append(f'  <circle cx="{win_x + 20}" cy="{win_y + 20}" r="6" fill="{t_colors[0]}" {stroke_attr}/>')
            svg_parts.append(f'  <circle cx="{win_x + 38}" cy="{win_y + 20}" r="6" fill="{t_colors[1]}" {stroke_attr}/>')
            svg_parts.append(f'  <circle cx="{win_x + 56}" cy="{win_y + 20}" r="6" fill="{t_colors[2]}" {stroke_attr}/>')
        elif frame_style == "terminal":
            svg_parts.append(f'  <text x="{win_x + 18}" y="{win_y + 25}" font-family="{font_family}" font-size="12" fill="{theme["accent"]}" font-weight="bold">$ bash</text>')
        elif frame_style == "windows":
            wx = win_x + window_width - 55
            wy = win_y + 20
            svg_parts.append(f'  <line x1="{wx}" y1="{wy}" x2="{wx + 8}" y2="{wy}" stroke="#888888" stroke-width="1.5"/>')
            svg_parts.append(f'  <rect x="{wx + 16}" y="{wy - 4}" width="8" height="8" fill="none" stroke="#888888" stroke-width="1.5"/>')
            svg_parts.append(f'  <line x1="{wx + 32}" y1="{wy - 4}" x2="{wx + 40}" y2="{wy + 4}" stroke="#888888" stroke-width="1.5"/>')
            svg_parts.append(f'  <line x1="{wx + 40}" y1="{wy - 4}" x2="{wx + 32}" y2="{wy + 4}" stroke="#888888" stroke-width="1.5"/>')

        # Header Title (File Name)
        escaped_filename = html.escape(file_name)
        title_x = win_x + (window_width / 2)
        svg_parts.append(f'  <text x="{title_x}" y="{win_y + 25}" text-anchor="middle" font-family="{font_family}" font-size="12" fill="#71717a" font-weight="500">{escaped_filename}</text>')

        # Language Badge
        badge_x = win_x + window_width - 16
        escaped_lang = html.escape(resolved_lang)
        svg_parts.append(f'  <text x="{badge_x}" y="{win_y + 25}" text-anchor="end" font-family="{font_family}" font-size="10" fill="#71717a" font-weight="600" letter-spacing="0.5">{escaped_lang.upper()}</text>')

    # Code Lines
    start_y = win_y + header_height + 18
    text_x = win_x + gutter_width + 12

    for idx, line in enumerate(tokenized_lines):
        line_num = start_line_number + idx
        cur_y = start_y + (idx * line_height)
        is_highlighted = line_num in highlight_lines

        # Line Highlight Background
        if is_highlighted:
            svg_parts.append(f'  <rect x="{win_x + 1}" y="{cur_y - 15}" width="{window_width - 2}" height="{line_height}" fill="rgba(255, 255, 255, 0.06)"/>')
            svg_parts.append(f'  <rect x="{win_x + 1}" y="{cur_y - 15}" width="3" height="{line_height}" fill="{theme["accent"]}"/>')

        # Line Number in Gutter
        if show_line_numbers:
            svg_parts.append(f'  <text x="{win_x + gutter_width - 6}" y="{cur_y}" text-anchor="end" font-family="{font_family}" font-size="{font_size}" fill="{theme["line_number"]}" select="none">{line_num}</text>')

        # Render Tokens
        svg_parts.append(f'  <text x="{text_x}" y="{cur_y}" font-family="{font_family}" font-size="{font_size}" xml:space="preserve">')
        for content, col in line:
            escaped_content = html.escape(content)
            # Detect diff markers
            if content.startswith("+") and not content.startswith("++"):
                col = "#4ade80"
            elif content.startswith("-") and not content.startswith("--"):
                col = "#f87171"
            svg_parts.append(f'<tspan fill="{col}">{escaped_content}</tspan>')
        svg_parts.append('</text>')

    # Footer Watermark
    if watermark:
        footer_y = win_y + window_height - 10
        escaped_wm = html.escape(watermark)
        svg_parts.append(f'  <text x="{win_x + window_width - 16}" y="{footer_y}" text-anchor="end" font-family="{font_family}" font-size="10" fill="rgba(255, 255, 255, 0.25)">{escaped_wm}</text>')

    svg_parts.append('</svg>')
    return "\n".join(svg_parts)
