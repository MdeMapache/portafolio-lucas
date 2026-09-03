import type { Config } from "tailwindcss";

/**
 * Paleta ciberpunk.
 *
 * Los tokens conservan los nombres `steam-*` a propósito: los usan ~15
 * componentes y renombrarlos sería un diff enorme sin ganancia funcional. Lo
 * que cambió son los VALORES — retonalizados a negro profundo con neón — así
 * que toda la app se repinta desde este archivo.
 *
 * Los `cyber-*` son los acentos nuevos: se usan donde el neón tiene que gritar
 * (bordes activos, glitch, brillos), no como color de texto general.
 */
export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        steam: {
          bgDeep: "#04060c",
          bgTop: "#0a1120",
          panel: "#080e1a",
          panel2: "#0f1829",
          line: "#1b3350",
          text: "#b8c9d9",
          dim: "#6b8299",
          bright: "#eaf6ff",
          link: "#00f0ff",
          linkHover: "#7df9ff",
          green: "#a3ff12",
          gold: "#ff2e97",
        },
        /*
          Paleta prestada de las pantallas de selección de Metal Warriors:
          verde fósforo sobre campo verde oscuro, franjas de peligro amarillas
          y el naranja oxidado del blindaje.

          Convive con `cyber-*` en vez de reemplazarla: el cian y el magenta
          siguen siendo la identidad del sitio, y esto entra donde la referencia
          aporta — marcos de selección, listas de equipamiento, avisos.
        */
        mw: {
          phosphor: "#4aff7a",
          phosphorDim: "#1f8f3c",
          field: "#0a2e12",
          fieldDeep: "#04160a",
          hazard: "#e0b91c",
          rust: "#c2551f",
        },
        cyber: {
          cyan: "#00f0ff",
          magenta: "#ff2e97",
          lime: "#a3ff12",
          violet: "#8b5cf6",
          void: "#04060c",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        "neon-cyan": "0 0 8px rgba(0,240,255,.45), inset 0 0 12px rgba(0,240,255,.08)",
        "neon-magenta": "0 0 8px rgba(255,46,151,.45), inset 0 0 12px rgba(255,46,151,.08)",
        "neon-lime": "0 0 8px rgba(163,255,18,.45)",
      },
    },
  },
  plugins: [],
} satisfies Config;
