import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.renderer.svg_engine import render_svg_snippet

code = '''def fibonacci(n: int) -> int:
    """Return the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Compute first 10 Fibonacci numbers
fib_sequence = [fibonacci(i) for i in range(10)]
print(f"Fibonacci: {fib_sequence}")
'''

svg = render_svg_snippet(
    code=code,
    language="python",
    file_name="fibonacci.py",
    theme_id="tokyo-night",
    background_id="cosmic-sunset",
    font_id="jetbrains-mono",
    frame_style="macos",
    show_line_numbers=True,
    padding=48
)

out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "examples")
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "fibonacci.svg")

with open(out_path, "w", encoding="utf-8") as f:
    f.write(svg)

print(f"✓ Generated {out_path} ({len(svg)} bytes)")
