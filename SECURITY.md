# Security Policy

DevPaper takes the security and integrity of our software seriously. We appreciate the efforts of security researchers and community members who responsibly discover and report vulnerabilities.

---

## Supported Versions

Only the current major release branch receives proactive security patches and maintenance updates.

| Version | Supported          | Security Maintenance Status |
|:-------:|:------------------:|:---------------------------:|
| `1.x`   | :white_check_mark: | Currently Supported         |
| `< 1.0` | :x:                | Unsupported                 |

---

## Reporting a Vulnerability

**Please DO NOT file public GitHub issues for security vulnerabilities.**

If you believe you have found a security vulnerability in DevPaper, please report it privately through one of the following channels:

1. **GitHub Private Vulnerability Reporting (Preferred):**  
   Navigate to the repository's [Security Tab](https://github.com/DevPaper/devpaper/security/advisories/new) and click **"Report a vulnerability"**. This creates an encrypted, private advisory draft visible only to maintainers.

2. **Direct Security Contact:**  
   If you cannot use GitHub Security Advisories, send an email directly to **itsjustayush.dev@gmail.com** with the subject line `[SECURITY] DevPaper Vulnerability Report`.

### What to Include in Your Report
To help us triage and resolve the issue quickly, please include:
- A clear description of the vulnerability and its potential impact.
- Step-by-step instructions or a minimal Proof of Concept (PoC) to reproduce the vulnerability.
- The affected subsystem (e.g., Web Studio, SVG Rendering Engine, PDF Generator, FastAPI Backend).
- Any proposed remediations or patches if available.

---

## Response Timeline & SLA

We commit to the following response timeline for security issues:
- **Initial Acknowledgement**: Within **48 hours** of receiving your report.
- **Triage & Assessment**: Within **5 business days**, confirming reproduction and assigning a severity rating (CVSS).
- **Patch Resolution**: We aim to provide a tested fix within **30 days** depending on complexity.
- **Public Disclosure**: Coordinated public disclosure will take place only after a patch is released, allowing users time to update.

---

## Security Best Practices for Self-Hosters

When running the DevPaper Python Headless Backend in production or public cloud environments:
- **Sandbox Containerization**: Run the FastAPI backend in an isolated container or microVM (e.g. Docker, Podman, or Vercel Sandbox).
- **Resource Constraints**: Apply CPU and memory limits to prevent Denial of Service via pathological source inputs or extremely large files.
- **Reverse Proxy**: Deploy behind a hardened reverse proxy (such as Cloudflare, Nginx, or Caddy) with rate limiting enabled.

---

## Safe Harbor

We consider security research conducted under this policy to be authorized. We will not pursue legal action against researchers who:
- Make a good-faith effort to avoid privacy violations, data destruction, and service degradation.
- Give maintainers reasonable time to remedy the issue before public disclosure.
- Do not exploit a security issue beyond the minimum necessary to demonstrate the proof of concept.

Thank you for helping keep DevPaper secure!

