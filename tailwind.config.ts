import type { Config } from "tailwindcss";

/**
 * Paleta Metal Warriors.
 *
 * La referencia son las pantallas de selección de unidades del juego: campo
 * verde saturado, texto en fósforo brillante, blindaje naranja óxido y franjas
 * de peligro amarillas, todo sobre canaletas negras.
 *
 * Los tokens `steam-*` conservan el nombre porque los usan ~20 componentes,
 * pero sus VALORES pasaron de azul a verde. Los antiguos `cyber-*` sí se
 * renombraron a `mw-*`: mantener un token llamado "cyan" que en realidad pinta
 * verde habría sido peor que el diff del renombrado.
 */
export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        steam: {
          bgDeep: "#010603",
          bgTop: "#0a2e12",
          panel: "#04180a",
          panel2: "#0a3d16",
          line: "#1f9c40",
          text: "#b6e8c2",
          dim: "#5d9c6b",
          bright: "#eafff0",
          link: "#46ff6e",
          linkHover: "#a5ffbc",
          green: "#46ff6e",
          gold: "#e8c020",
        },
        mw: {
          /** Texto de terminal: el verde que usan los nombres de unidad. */
          phosphor: "#46ff6e",
          phosphorDim: "#1f9c40",
          /** Blindaje de los mechs. */
          rust: "#e0701f",
          rustDeep: "#a83c12",
          /** Franjas de advertencia. */
          hazard: "#e8c020",
          /** El azul violáceo del Ballistic, para la cuarta posición del ciclo. */
          steel: "#7a72c4",
          /** Campo verde de los paneles de selección. */
          field: "#0a4a18",
          fieldDeep: "#052a0c",
          /** Canaletas entre paneles. */
          void: "#010603",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        "glow-phosphor": "0 0 9px rgba(70,255,110,.5), inset 0 0 14px rgba(70,255,110,.08)",
        "glow-rust": "0 0 9px rgba(224,112,31,.5), inset 0 0 14px rgba(224,112,31,.08)",
        "glow-hazard": "0 0 9px rgba(232,192,32,.5), inset 0 0 14px rgba(232,192,32,.08)",
        "glow-steel": "0 0 9px rgba(122,114,196,.5), inset 0 0 14px rgba(122,114,196,.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
