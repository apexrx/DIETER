import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        border: "var(--border)",
        "te-text": "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-dim": "var(--accent-dim)",
        "led-green": "var(--led-green)",
        "led-red": "var(--led-red)",
        "led-amber": "var(--led-amber)",
        "screen-bg": "var(--screen-bg)",
        "screen-text": "var(--screen-text)",
        "btn-hover": "var(--btn-hover)",
        "btn-active": "var(--btn-active)",
        disabled: "var(--btn-disabled)",
        "disabled-text": "var(--btn-disabled-text)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
        "terminal-bg": "var(--terminal-bg)",
        "terminal-text": "var(--terminal-text)",
        "terminal-muted": "var(--terminal-muted)",
        "log-error": "var(--log-error)",
        background: "var(--bg)",
        foreground: "var(--text)",
      },
      fontFamily: {
        mono: ["DM Mono", "IBM Plex Mono", "SF Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
