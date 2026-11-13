# Contributing to DevPaper

Thank you for your interest in contributing to **DevPaper**! DevPaper is an open-source, web-based code presentation and typesetting studio designed for developers, technical writers, and AI agents.

This guide provides everything you need to know about our branching workflow, GitHub rulesets, continuous integration, and coding standards.

---

## 1. Canonical Upstream Repository & Forking Model

* **Canonical Upstream Repository**: `https://github.com/DevPaper/devpaper`
* **Source of Truth**: The `main` branch is always releasable and protected.

### Unaffiliated Contributors (Fork-and-Pull-Request Model)
If you are an external or unaffiliated contributor:
1. **Fork** the repository on GitHub to your personal account (`origin`).
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/devpaper.git
   cd devpaper
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/DevPaper/devpaper.git
   git fetch upstream
   ```
4. **Keep your fork synchronized** before opening or updating a PR:
   ```bash
   # Using GitHub CLI:
   gh repo sync <your-username>/devpaper

   # Or using standard Git:
   git checkout main
   git fetch upstream
   git merge upstream/main
   git push origin main
   ```

### Core Collaborators
Regular repository collaborators with write access work directly within short-lived branches on the upstream repository and submit pull requests into `main`.

---

## 2. Branching Strategy

We enforce a short-lived branch model centered on `main`. **We do not use a permanent `develop` branch.**

Branch naming conventions:

| Branch Pattern | Purpose | Example |
|---|---|---|
| `main` | Always releasable; protected source of truth | `main` |
| `feature/<short-name>` | New capabilities or enhancements | `feature/tokyo-night-storm` |
| `fix/<short-name>` | Bug fixes and crash resolutions | `fix/pdf-page-split` |
| `docs/<short-name>` | Documentation, tutorials, and specs | `docs/agent-api-guide` |
| `chore/<short-name>` | Maintenance, dependencies, and tooling | `chore/update-shiki` |
| `release/<version>` | Optional stabilization branch for larger releases | `release/v1.1.0` |

---

## 3. GitHub Rulesets & Branch Protection

### Protected Branch: `main`
The `main` branch is guarded by GitHub Rulesets with the following enforced requirements:
1. **Pull Request Required**: Direct pushes to `main` are strictly blocked.
2. **Approving Reviews**: At least **1 approving review** is required for standard changes; **2 approvals** are required for security-sensitive, export engine, or workflow changes.
3. **Dismiss Stale Approvals**: Approvals are automatically dismissed when new commits are pushed to an open pull request.
4. **Code Owners Review**: Review from designated code owners in [`.github/CODEOWNERS`](.github/CODEOWNERS) is mandatory for touched paths.
5. **Required Status Checks**: All CI jobs (Linting, Frontend Unit Tests, Python Backend Tests, and Next.js Build) must pass.
6. **Up-to-Date Branches**: Branches must be rebased or updated with `main` before merging.
7. **Conversation Resolution**: All PR review discussions and review comments must be resolved.
8. **No Force Pushes or Deletions**: Force pushes (`git push --force`) and branch deletions are blocked.
9. **Linear History**: Merges are squashed by default to ensure clean, bisectable commit logs.

### Release Tag Ruleset: `refs/tags/v*`
1. Release tags must follow Semantic Versioning (e.g. `v1.0.0`, `v1.2.3`).
2. Tag force-updating and deletion are prohibited.
3. Release tags can only be created by maintainers or verified release automation bots pointing to already-reviewed commits on `main`.

---

## 4. Pull Request Requirements & CI Checks

Every pull request triggers our automated GitHub Actions CI pipeline:

1. **Format & Lint**: Runs ESLint and validates TypeScript code quality (`npm run lint`).
2. **Frontend Unit Tests**: Runs the Vitest test suite (`npm test`).
3. **Backend Unit Tests**: Sets up Python 3.12, installs dependencies, and runs the FastAPI test suite (`python backend/test_api.py`).
4. **Production Build Validation**: Compiles the Next.js production bundle (`npm run build`) to guarantee static generation and bundling succeed.
5. **Security & Dependency Check**: Scans for known vulnerabilities and secret leaks.

> [!IMPORTANT]
> Untrusted pull-request code from forks is never executed with write access to repository secrets. All third-party GitHub Actions are pinned to specific versions.

---

## 5. Commit & Merge Conventions

We use **Squash Merging** into `main`. The pull-request title becomes the squash commit message on `main`.

Please use clear, conventional commit titles:
* `feat(editor): add support for ligatures toggle`
* `fix(exporter): prevent canvas lockup on 20+ page PDF exports`
* `docs(api): add curl recipe for multi-file zip packaging`
* `chore(deps): bump pygments to 2.18.0`

---

## 6. Development Quickstart

### Prerequisites
* **Node.js**: v20 or later
* **Package Manager**: `npm` or `pnpm`
* **Python**: v3.10+ (for backend microservice)

### Frontend Studio Setup
```bash
git clone https://github.com/DevPaper/devpaper.git
cd devpaper

# Install frontend dependencies
npm install

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the studio.

### Backend Setup (FastAPI & Python Renderers)
```bash
cd backend
python -m venv .venv

# Activate virtualenv (Windows)
.venv\Scripts\activate
# Activate virtualenv (Linux/macOS)
source .venv/bin/activate

pip install -r requirements.txt
python run.py
```
Open [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive Swagger API documentation.

### Running Test Suites
```bash
# Frontend tests (Vitest)
npm test

# Backend tests (Python)
npm run test:backend
# or: python backend/test_api.py
```

---

## 7. Adding New Capabilities (Plugin Registries)

DevPaper isolates visual options into declarative registries in `src/registries/`:

### A. Adding a Syntax Theme (`src/registries/themes.ts`)
```typescript
export const THEME_REGISTRY: Record<string, ThemeDefinition> = {
  'my-theme': {
    id: 'my-theme',
    name: 'My Theme',
    type: 'dark',
    background: '#1a1b26',
    foreground: '#a9b1d6',
    selection: '#283457',
    cursor: '#c0caf5',
    lineHighlight: '#24283b',
    diffAdd: 'rgba(72, 199, 142, 0.25)',
    diffRemove: 'rgba(241, 70, 104, 0.25)',
    accent: '#7aa2f7',
    border: '#292e42',
    syntax: {
      keywords: '#bb9af7',
      strings: '#9ece6a',
      functions: '#7aa2f7',
      variables: '#c0caf5',
      comments: '#565f89',
      numbers: '#ff9e64',
      operators: '#89ddff',
      types: '#2ac3de',
      punctuation: '#9abdf5',
    },
    shikiTheme: 'tokyo-night',
  },
};
```

### B. Adding a Developer Font (`src/registries/fonts.ts`)
```typescript
export const FONT_REGISTRY: Record<string, FontDefinition> = {
  'my-mono': {
    id: 'my-mono',
    name: 'My Mono',
    fontFamily: '"My Mono", monospace',
    category: 'monospace',
    ligatures: true,
    weights: [400, 600],
    webFontUrl: 'https://fonts.googleapis.com/css2?family=My+Mono&display=swap',
    sampleCode: 'const greeting = (name: string) => `Hello, ${name}!`;',
  },
};
```

### C. Adding a Paper Size Preset (`src/registries/paperSizes.ts`)
```typescript
export const PAPER_REGISTRY: Record<string, PaperPreset> = {
  'b5-portrait': {
    id: 'b5-portrait',
    name: 'ISO B5 Book',
    category: 'print',
    widthMm: 176,
    heightMm: 250,
    widthPx: 665,
    heightPx: 945,
    dpi: 96,
    aspectRatio: '176/250',
    description: 'Standard book and manual format.',
  },
};
```

---

## 8. Questions & Community

* **Report a Bug**: [Open a Bug Report](https://github.com/DevPaper/devpaper/issues/new?template=bug_report.yml)
* **Request a Feature**: [Open a Feature Request](https://github.com/DevPaper/devpaper/issues/new?template=feature_request.yml)
* **Submit Usage to Adopters**: [Submit to Used by](https://github.com/DevPaper/devpaper/issues/new?template=used_by.yml)
* **Security Advisories**: Follow [SECURITY.md](SECURITY.md) for private vulnerability reporting.
* **Code of Conduct**: All participants are expected to adhere to our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
