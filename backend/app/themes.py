"""
DevPaper Built-in Themes and Canvas Backgrounds for Python Backend
"""

THEMES = {
    "tokyo-night": {
        "name": "Tokyo Night",
        "background": "#1a1b26",
        "foreground": "#a9b1d6",
        "accent": "#7aa2f7",
        "border": "rgba(255, 255, 255, 0.08)",
        "traffic_lights": ["#ff5f56", "#ffbd2e", "#27c93f"],
        "line_number": "#414868",
        "pygments_style": "nord-darker",
    },
    "one-dark-pro": {
        "name": "One Dark Pro",
        "background": "#282c34",
        "foreground": "#abb2bf",
        "accent": "#61afef",
        "border": "rgba(255, 255, 255, 0.08)",
        "traffic_lights": ["#e06c75", "#e5c07b", "#98c379"],
        "line_number": "#5c6370",
        "pygments_style": "monokai",
    },
    "dracula": {
        "name": "Dracula",
        "background": "#282a36",
        "foreground": "#f8f8f2",
        "accent": "#bd93f9",
        "border": "rgba(255, 255, 255, 0.08)",
        "traffic_lights": ["#ff5555", "#f1fa8c", "#50fa7b"],
        "line_number": "#6272a4",
        "pygments_style": "dracula",
    },
    "catppuccin": {
        "name": "Catppuccin Macchiato",
        "background": "#24273a",
        "foreground": "#cad3f5",
        "accent": "#c6a0f6",
        "border": "rgba(255, 255, 255, 0.08)",
        "traffic_lights": ["#ed8796", "#eed49f", "#a6da95"],
        "line_number": "#5b6078",
        "pygments_style": "nord-darker",
    },
    "nord": {
        "name": "Nord",
        "background": "#2e3440",
        "foreground": "#d8dee9",
        "accent": "#88c0d0",
        "border": "rgba(255, 255, 255, 0.08)",
        "traffic_lights": ["#bf616a", "#ebcb8b", "#a3be8c"],
        "line_number": "#4c566a",
        "pygments_style": "nord",
    },
    "monokai": {
        "name": "Monokai Pro",
        "background": "#2d2a2e",
        "foreground": "#fcfcfa",
        "accent": "#ffd866",
        "border": "rgba(255, 255, 255, 0.08)",
        "traffic_lights": ["#ff6188", "#ffd866", "#a9dc76"],
        "line_number": "#727072",
        "pygments_style": "monokai",
    },
    "github-dark": {
        "name": "GitHub Dark",
        "background": "#0d1117",
        "foreground": "#c9d1d9",
        "accent": "#58a6ff",
        "border": "rgba(255, 255, 255, 0.1)",
        "traffic_lights": ["#ff7b72", "#d29922", "#3fb950"],
        "line_number": "#484f58",
        "pygments_style": "github-dark",
    },
    "github-light": {
        "name": "GitHub Light",
        "background": "#ffffff",
        "foreground": "#24292f",
        "accent": "#0969da",
        "border": "rgba(0, 0, 0, 0.1)",
        "traffic_lights": ["#cf222e", "#9a6700", "#1a7f37"],
        "line_number": "#8c959f",
        "pygments_style": "friendly",
    },
    "synthwave-84": {
        "name": "Synthwave '84",
        "background": "#262335",
        "foreground": "#ff7edb",
        "accent": "#36f9f6",
        "border": "rgba(255, 255, 255, 0.12)",
        "traffic_lights": ["#fe4450", "#ff8b39", "#72f1b8"],
        "line_number": "#614d85",
        "pygments_style": "monokai",
    },
}

BACKGROUNDS = {
    "aurora": {
        "name": "Aurora Glow",
        "gradient": "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        "svg_stops": [("#0f2027", "0%"), ("#203a43", "50%"), ("#2c5364", "100%")],
    },
    "cosmic-sunset": {
        "name": "Cosmic Sunset",
        "gradient": "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
        "svg_stops": [("#1f1c2c", "0%"), ("#928dab", "100%")],
    },
    "neon-dusk": {
        "name": "Neon Dusk",
        "gradient": "linear-gradient(135deg, #2b1055 0%, #7597de 100%)",
        "svg_stops": [("#2b1055", "0%"), ("#7597de", "100%")],
    },
    "ember-glow": {
        "name": "Ember Glow",
        "gradient": "linear-gradient(135deg, #200122 0%, #6f0000 100%)",
        "svg_stops": [("#200122", "0%"), ("#6f0000", "100%")],
    },
    "ocean-abyss": {
        "name": "Ocean Abyss",
        "gradient": "linear-gradient(135deg, #000428 0%, #004e92 100%)",
        "svg_stops": [("#000428", "0%"), ("#004e92", "100%")],
    },
    "obsidian": {
        "name": "Obsidian Slate",
        "gradient": "#0f1117",
        "svg_stops": [("#0f1117", "0%"), ("#181a20", "100%")],
    },
    "transparent": {
        "name": "Transparent",
        "gradient": "transparent",
        "svg_stops": [],
    },
}

FONTS = {
    "jetbrains-mono": '"JetBrains Mono", Menlo, Consolas, Monaco, monospace',
    "fira-code": '"Fira Code", Menlo, Consolas, Monaco, monospace',
    "geist-mono": '"Geist Mono", Menlo, Consolas, Monaco, monospace',
    "ibm-plex-mono": '"IBM Plex Mono", Menlo, Consolas, Monaco, monospace',
    "cascadia-code": '"Cascadia Code", Menlo, Consolas, monospace',
    "source-code-pro": '"Source Code Pro", Menlo, Consolas, monospace',
    "system-mono": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
}

