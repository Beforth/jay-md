import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0D1117",
        blue: "#1A5BFF",
        "slate-bg": "#EDF0F8",
        white: "#FFFFFF",
        "deep-navy": "#1C2333",
        stone: "#6B7280",
        border: "#D1D8E8",
        "blue-tint": "#EBF0FF",
        "dot-grid": "#C2CEE8",
        warn: "#B45309",
        "warn-bg": "#FDF5E7",
        danger: "#C0392B",
        "danger-bg": "#FCECEC",
      },
      borderColor: {
        DEFAULT: "#D1D8E8",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Bebas Neue", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wide2: "0.08em",
        wider2: "0.12em",
      },
      maxWidth: {
        prose: "760px",
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "0.95" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.05" }],
        "display-sm": ["1.5rem", { lineHeight: "1.1" }],
      },
    },
  },
  plugins: [],
};
export default config;
