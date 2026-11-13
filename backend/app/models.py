"""
DevPaper API Request & Response Schemas
"""

from typing import List, Optional
from pydantic import BaseModel, Field

class SnippetRequest(BaseModel):
    code: str = Field(..., description="Source code text to typeset and format")
    language: Optional[str] = Field("auto", description="Programming language (e.g. python, typescript, rust, go, sql, bash)")
    file_name: Optional[str] = Field("snippet.ts", description="File name displayed in window header")
    theme: Optional[str] = Field("tokyo-night", description="Theme ID (tokyo-night, one-dark-pro, dracula, catppuccin, nord, monokai, github-dark, github-light)")
    background: Optional[str] = Field("cosmic-sunset", description="Background preset (aurora, cosmic-sunset, neon-dusk, ember-glow, ocean-abyss, obsidian, transparent)")
    font: Optional[str] = Field("jetbrains-mono", description="Typography font ID (jetbrains-mono, fira-code, geist-mono, ibm-plex-mono, cascadia-code, source-code-pro)")
    frame: Optional[str] = Field("macos", description="Window chrome style (macos, macos-outline, windows, terminal, minimal, none)")
    show_line_numbers: Optional[bool] = Field(True, description="Render line number gutter")
    start_line_number: Optional[int] = Field(1, description="Starting line number")
    padding: Optional[int] = Field(48, description="Canvas padding in pixels (16, 32, 48, 64)")
    border_radius: Optional[int] = Field(16, description="Window frame corner radius in pixels")
    watermark: Optional[str] = Field("DevPaper", description="Footer watermark attribution")
    highlight_lines: Optional[List[int]] = Field(default_factory=list, description="List of line numbers to visually highlight")
    format: Optional[str] = Field("svg", description="Export format: 'svg', 'png', 'pdf', or 'html'")
    paper_size: Optional[str] = Field("auto", description="Paper preset: auto, a4, letter, 16:9, opengraph")

    model_config = {
        "json_schema_extra": {
            "example": {
                "code": "def fibonacci(n: int) -> int:\n    return n if n <= 1 else fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(fibonacci(10))",
                "language": "python",
                "file_name": "fibonacci.py",
                "theme": "tokyo-night",
                "background": "cosmic-sunset",
                "format": "svg",
                "show_line_numbers": True
            }
        }
    }

class SourceFile(BaseModel):
    name: str = Field(..., description="File name including extension")
    code: str = Field(..., description="Source code text")
    language: Optional[str] = Field("auto", description="Programming language")

class MultiFileRequest(BaseModel):
    files: List[SourceFile] = Field(..., description="List of source files to batch render")
    format: Optional[str] = Field("zip", description="Export bundle format: 'zip' or 'pdf'")
    theme: Optional[str] = Field("tokyo-night", description="Theme ID")
    background: Optional[str] = Field("cosmic-sunset", description="Background preset")
    font: Optional[str] = Field("jetbrains-mono", description="Typography font ID")
    frame: Optional[str] = Field("macos", description="Window frame style")
    show_line_numbers: Optional[bool] = Field(True, description="Render line numbers")
    paper_size: Optional[str] = Field("a4", description="Paper size: a4, letter, auto")
    watermark: Optional[str] = Field("DevPaper Studio", description="Watermark text")
    archive_name: Optional[str] = Field("devpaper-bundle", description="Name of the exported zip/pdf file")
