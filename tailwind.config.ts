import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces & text (Direction A — "Warm Civic")
        app: "#F6F1E9",
        surface: "#FFFFFF",
        "surface-alt": "#FBF8F2",
        "warm-panel": "#FAF6EF",
        ink: "#2A2419",
        "text-secondary": "#5B5346",
        "text-muted": "#8A8070",
        "text-muted-2": "#A89E8D",
        "text-faint": "#B0A594",
        "text-faint-2": "#B6AC9C",
        accent: "#E8833A",
        "accent-tint": "#FBEAD9",
        "live-green": "#5CC15F",
        "canvas-backdrop": "#CFC8BC",
        // Borders (warm greys)
        "border-warm": "#EBE3D6",
        "border-warm-2": "#E8E0D2",
        "border-warm-3": "#EEE6D8",
        "border-warm-4": "#EFE7D8",
        // Map palette
        "map-canvas": "#ECE6DB",
        "map-grid": "#FBFAF6",
        "map-park": "#D9E4CB",
        "map-river": "#C7D8E6",
        "map-highway": "#F2B27C",
        "map-highway-2": "#F4C79B",
        "map-label": "#9A8F7C",
        "map-wordmark": "#B7AD98",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        sans: ["var(--font-hanken)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        chip: "8px",
        btn: "10px",
        card: "13px",
        panel: "16px",
        shell: "14px",
        tile: "11px",
      },
      boxShadow: {
        "card-subtle": "0 1px 2px rgba(0,0,0,.02)",
        pin: "0 6px 14px rgba(0,0,0,.18)",
        "pin-active": "0 8px 18px rgba(232,131,58,.35)",
        detail: "0 18px 50px rgba(30,20,10,.24)",
        toast: "0 8px 22px rgba(0,0,0,.25)",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "translate(-50%,-50%) scale(0.85)", opacity: "0.55" },
          "100%": { transform: "translate(-50%,-50%) scale(2.4)", opacity: "0" },
        },
        liveGlow: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(92,193,95,.45)" },
          "50%": { opacity: "0.7", boxShadow: "0 0 0 5px rgba(92,193,95,0)" },
        },
        panelIn: {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "pulse-ring": "pulseRing 2.2s ease-out infinite",
        "live-glow": "liveGlow 2s ease-in-out infinite",
        "panel-in": "panelIn 180ms ease-out",
        "fade-in": "fadeIn 150ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
