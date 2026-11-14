"""
DevPaper API Test Script (apitest.py)

Demonstrates how developers and AI agents can programmatically typeset code directly from local files
(e.g., samplegreet.ts, main.py, index.html) with zero manual copy-pasting.

Workspace Convention:
  DevPaper has no cloud storage facility; no user code is ever saved to the cloud.
  For programmatic usage, all generated artifacts (.pdf, .svg, .png, .zip) are automatically
  downloaded and saved into the `/devpaper` directory in the root of the workspace.

Usage:
    python apitest.py [optional_file_path]
"""

import sys
import os
import requests

API_BASE_URL = os.environ.get("DEVPAPER_API_URL", "http://localhost:8000")

# Programmatic Workspace Output Directory (/devpaper)
WORKSPACE_ROOT = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(WORKSPACE_ROOT, "devpaper")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def is_server_online(url: str) -> bool:
    """Checks if the local DevPaper server is responding."""
    try:
        res = requests.get(f"{url}/api/v1/health", timeout=1.5)
        return res.status_code == 200
    except Exception:
        return False

def write_sample_file(filename: str = "samplegreet.ts") -> str:
    """Writes or rewrites sample code into a local file."""
    code_content = '''/**
 * Sample Greeting Service
 * Typeset and formatted via DevPaper API
 */
export interface UserGreeting {
  id: string;
  name: string;
  timestamp: string;
}

export function generateGreeting(name: string): UserGreeting {
  const formattedName = name.trim();
  return {
    id: `user_${Date.now()}`,
    name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
    timestamp: new Date().toISOString(),
  };
}

// Quick Test Execution
const greeting = generateGreeting("world");
console.log(`[DevPaper] Greeting: Hello, ${greeting.name}!`);
'''
    with open(filename, "w", encoding="utf-8") as f:
        f.write(code_content)
    print(f"✓ Wrote/Updated source file: '{filename}' ({len(code_content.splitlines())} lines)")
    return filename

def run_tests():
    target_file = sys.argv[1] if len(sys.argv) > 1 else "samplegreet.ts"
    
    # 1. Ensure file exists or write sample code
    if not os.path.exists(target_file):
        target_file = write_sample_file(target_file)
    else:
        print(f"✓ Using source file: '{target_file}'")

    online = is_server_online(API_BASE_URL)
    pdf_out = os.path.join(OUTPUT_DIR, "greet.pdf")
    svg_out = os.path.join(OUTPUT_DIR, "greet.svg")

    if online:
        print(f"\n[Mode: Live HTTP Server] Connected to {API_BASE_URL}")
        # Test 1: JSON File payload
        endpoint = f"{API_BASE_URL}/api/v1/snippet"
        payload = {
            "code": target_file,  # Pass the file path directly in 'code' or 'file_path'!
            "file_name": "greet.ts",
            "theme": "one-dark-pro",
            "background": "cosmic-sunset",
            "format": "pdf",
            "show_line_numbers": True
        }
        res = requests.post(endpoint, json=payload, timeout=10)
        assert res.status_code == 200, f"Error {res.status_code}: {res.text}"
        with open(pdf_out, "wb") as f:
            f.write(res.content)
        print(f"✓ [JSON File Path] Generated '{pdf_out}' ({len(res.content)} bytes)")

        # Test 2: Multipart Upload
        upload_endpoint = f"{API_BASE_URL}/api/v1/snippet/upload"
        with open(target_file, "rb") as f:
            files = {"file": (target_file, f, "text/plain")}
            data = {"theme": "tokyo-night", "format": "svg"}
            res2 = requests.post(upload_endpoint, files=files, data=data, timeout=10)
        assert res2.status_code == 200, f"Error {res2.status_code}: {res2.text}"
        with open(svg_out, "wb") as f:
            f.write(res2.content)
        print(f"✓ [Multipart Upload] Generated '{svg_out}' ({len(res2.content)} bytes)")

    else:
        print(f"\n[Mode: Direct FastAPI TestClient] (Server offline at {API_BASE_URL})")
        # Add backend to path and test via FastAPI TestClient
        sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend"))
        from fastapi.testclient import TestClient
        from app.main import app

        client = TestClient(app)

        # Test 1: JSON File payload
        payload = {
            "code": target_file,
            "file_name": "greet.ts",
            "theme": "one-dark-pro",
            "background": "cosmic-sunset",
            "format": "pdf",
            "show_line_numbers": True
        }
        res = client.post("/api/v1/snippet", json=payload)
        assert res.status_code == 200, f"Error {res.status_code}: {res.text}"
        with open(pdf_out, "wb") as f:
            f.write(res.content)
        print(f"✓ [JSON File Path] Generated '{pdf_out}' ({len(res.content)} bytes)")

        # Test 2: Multipart Upload
        with open(target_file, "rb") as f:
            files = {"file": (target_file, f, "text/plain")}
            data = {"theme": "tokyo-night", "format": "svg"}
            res2 = client.post("/api/v1/snippet/upload", files=files, data=data)
        assert res2.status_code == 200, f"Error {res2.status_code}: {res2.text}"
        with open(svg_out, "wb") as f:
            f.write(res2.content)
        print(f"✓ [Multipart Upload] Generated '{svg_out}' ({len(res2.content)} bytes)")

    print("\n✓ DevPaper API test routine completed successfully!")
    print(f"  All outputs saved into workspace directory: '{OUTPUT_DIR}'")
    print(f"  • {pdf_out}")
    print(f"  • {svg_out}")

if __name__ == "__main__":
    run_tests()
