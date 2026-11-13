"""
Backend Unit Test Suite
"""

import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.renderer.svg_engine import render_svg_snippet, resolve_language
from app.renderer.pdf_engine import generate_pdf_document
from app.renderer.zip_engine import generate_zip_archive
from app.models import SourceFile

def test_svg_engine():
    code = "def hello():\n    print('Hello DevPaper')\nhello()"
    svg = render_svg_snippet(
        code=code,
        language="python",
        file_name="hello.py",
        theme_id="tokyo-night",
        background_id="cosmic-sunset",
    )
    assert "<svg" in svg
    assert "</svg>" in svg
    assert "Hello DevPaper" in svg
    assert "hello.py" in svg
    print("✓ SVG Engine test passed")

def test_language_detection():
    assert resolve_language("test.py", "x = 1", "auto") == "python"
    assert resolve_language("app.ts", "const x: number = 1;", "auto") == "typescript"
    assert resolve_language("query.sql", "SELECT * FROM users", "auto") == "sql"
    print("✓ Language Detection test passed")

def test_pdf_engine():
    code = "print('PDF Test')\n" * 40
    pdf_bytes = generate_pdf_document(code=code, file_name="test.py")
    assert len(pdf_bytes) > 500
    assert pdf_bytes.startswith(b"%PDF")
    print("✓ PDF Engine test passed")

def test_zip_engine():
    files = [
        SourceFile(name="main.py", code="print('main')", language="python"),
        SourceFile(name="utils.py", code="def helper(): pass", language="python"),
    ]
    zip_bytes = generate_zip_archive(files)
    assert len(zip_bytes) > 200
    assert zip_bytes.startswith(b"PK")
    print("✓ ZIP Engine test passed")

if __name__ == "__main__":
    test_svg_engine()
    test_language_detection()
    test_pdf_engine()
    test_zip_engine()
    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY! 🚀")

