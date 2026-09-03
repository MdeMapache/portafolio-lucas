/**
 * Ciclo de colores de acento.
 *
 * El orden importa: arranca en óxido y termina en verde. El verde va último a
 * propósito, porque en esta paleta significa "operativo" y si encabezara el
 * ciclo volvería a teñir el sitio entero como antes.
 *
 * Las clases van escritas completas: Tailwind analiza el código de forma
 * estática y no vería una clase armada por concatenación.
 */
export type Accent = {
  text: string;
  border: string;
  glow: string;
  bg: string;
  /** El mismo color en hexadecimal, para dibujar en canvas. */
  hex: string;
};

export const ACCENTS: Accent[] = [
  {
    text: "text-mw-rust",
    border: "border-mw-rust/45",
    glow: "hover:border-mw-rust hover:shadow-glow-rust",
    bg: "bg-mw-rust/10",
    hex: "#d2601f",
  },
  {
    text: "text-mw-hazard",
    border: "border-mw-hazard/45",
    glow: "hover:border-mw-hazard hover:shadow-glow-hazard",
    bg: "bg-mw-hazard/10",
    hex: "#e8b020",
  },
  {
    text: "text-mw-steel",
    border: "border-mw-steel/45",
    glow: "hover:border-mw-steel hover:shadow-glow-steel",
    bg: "bg-mw-steel/10",
    hex: "#5f8ca8",
  },
  {
    text: "text-mw-phosphor",
    border: "border-mw-phosphor/45",
    glow: "hover:border-mw-phosphor hover:shadow-glow-phosphor",
    bg: "bg-mw-phosphor/10",
    hex: "#5fd17a",
  },
];

export function accentFor(index: number): Accent {
  return ACCENTS[index % ACCENTS.length];
}

/**
 * Acentos por significado, para cuando el color comunica estado y no sólo
 * ritmo visual: un puesto vigente va en ámbar de advertencia, uno terminado en
 * verde de "operativo". Elegirlos por nombre deja claro en el código que la
 * decisión no es decorativa.
 */
export const ACCENT_RUST = ACCENTS[0];
export const ACCENT_HAZARD = ACCENTS[1];
export const ACCENT_STEEL = ACCENTS[2];
export const ACCENT_PHOSPHOR = ACCENTS[3];
