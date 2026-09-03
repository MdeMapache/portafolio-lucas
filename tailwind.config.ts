import type { Config } from "tailwindcss";

/**
 * Paleta industrial.
 *
 * Antes todo era verde fósforo: texto, bordes, barras y divisores. Con el verde
 * en la BASE, los acentos no se distinguían y el conjunto se leía monocromo.
 *
 * Acá el verde baja a color de estado —"esto está OK"— y la superficie pasa a
 * ser acero: gunmetal, chapa fría, líneas de acero. Los acentos son de sala de
 * máquinas: óxido, ámbar de advertencia y azul hidráulico.
 *
 * Los tokens `steam-*` conservan el nombre porque los usan casi todos los
 * componentes; lo que cambia son los valores.
 */
export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        steam: {
          bgDeep: "#0a0d10",
          bgTop: "#1a1f26",
          panel: "#141a20",
          panel2: "#232b34",
          line: "#465260",
          text: "#c2ccd6",
          dim: "#7d8a97",
          bright: "#eef3f8",
          /** Los enlaces pasan a ámbar: en una sala de máquinas, lo que hay que
              mirar está señalizado en ámbar, no en verde. */
          link: "#e8901c",
          linkHover: "#ffb347",
          green: "#5fd17a",
          gold: "#e8b020",
        },
        mw: {
          /** Verde de estado. Más apagado que un fósforo de terminal: acá sólo
              significa "operativo", no es el color del sitio. */
          phosphor: "#5fd17a",
          phosphorDim: "#2e7a44",
          /** Óxido del blindaje. */
          rust: "#d2601f",
          rustDeep: "#8f3a10",
          /** Ámbar de advertencia y franjas de peligro. */
          hazard: "#e8b020",
          /** Azul hidráulico: mangueras, líneas de presión. */
          steel: "#5f8ca8",
          steelLight: "#93b4c8",
          /** Chapa: la superficie sobre la que se monta todo. */
          field: "#1c2229",
          fieldDeep: "#11161b",
          /** Sombra entre piezas. */
          void: "#0a0d10",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        "glow-phosphor": "0 0 9px rgba(95,209,122,.45), inset 0 0 14px rgba(95,209,122,.07)",
        "glow-rust": "0 0 9px rgba(210,96,31,.5), inset 0 0 14px rgba(210,96,31,.08)",
        "glow-hazard": "0 0 9px rgba(232,176,32,.5), inset 0 0 14px rgba(232,176,32,.08)",
        "glow-steel": "0 0 9px rgba(95,140,168,.5), inset 0 0 14px rgba(95,140,168,.08)",
        /** Relieve de chapa: luz arriba, sombra abajo. */
        plate: "inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.5)",
      },
    },
  },
  plugins: [],
} satisfies Config;
