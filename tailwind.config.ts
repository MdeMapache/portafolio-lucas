import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steam: {
          bgDeep: "#0e1621",
          bgTop: "#1b2838",
          panel: "#16202d",
          panel2: "#1e2c3d",
          line: "#2a3f5a",
          text: "#c6d4df",
          dim: "#7f9cb3",
          bright: "#ffffff",
          link: "#66c0f4",
          linkHover: "#9cd6ff",
          green: "#a4d007",
          gold: "#cc9a06",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
