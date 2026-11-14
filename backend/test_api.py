"""
Backend Unit Test Suite
"""

import sys
import os
import tempfile
from pathlib import Path

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.renderer.svg_engine import render_svg_snippet, resolve_language
from app.renderer.pdf_engine import generate_pdf_document
from app.renderer.zip_engine import generate_zip_archive
from app.models import SourceFile, SnippetRequest
from app.main import resolve_code_source

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

def test_file_source_resolution():
    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False) as f:
        f.write("def sample_greet():\n    return 'Hello from file!'\n")
        temp_name = f.name

    try:
        # Test 1: explicit file_path
        code, fname, lang = resolve_code_source(file_path=temp_name)
        assert "Hello from file!" in code
        assert lang == "python"
        assert fname == Path(temp_name).name

        # Test 2: passing file path in code field
        code2, fname2, lang2 = resolve_code_source(code=temp_name)
        assert "Hello from file!" in code2
        assert lang2 == "python"

        # Test 3: SnippetRequest model validation with file_path
        req = SnippetRequest(file_path=temp_name, theme="tokyo-night")
        assert req.file_path == temp_name

        print("✓ Direct File Source Resolution test passed")
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)

if __name__ == "__main__":
    test_svg_engine()
    test_language_detection()
    test_pdf_engine()
    test_zip_engine()
    test_file_source_resolution()
    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY! 🚀")
