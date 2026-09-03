/**
 * Ciclo de colores de acento.
 *
 * El dossier del perfil asigna un color distinto a cada tarjeta, y eso es lo
 * que le da ritmo a la sección. Centralizarlo acá permite repetir ese ritmo en
 * las listas del resto de las pestañas sin escribir el color a mano en cada
 * componente.
 *
 * Las clases van escritas completas a propósito: Tailwind analiza el código
 * de forma estática y no vería una clase armada por concatenación.
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
    border: "border-mw-rust/40",
    glow: "hover:border-mw-rust hover:shadow-glow-rust",
    bg: "bg-mw-rust/10",
    hex: "#e0701f",
  },
  {
    text: "text-mw-phosphor",
    border: "border-mw-phosphor/40",
    glow: "hover:border-mw-phosphor hover:shadow-glow-phosphor",
    bg: "bg-mw-phosphor/10",
    hex: "#46ff6e",
  },
  {
    text: "text-mw-hazard",
    border: "border-mw-hazard/40",
    glow: "hover:border-mw-hazard hover:shadow-glow-hazard",
    bg: "bg-mw-hazard/10",
    hex: "#e8c020",
  },
  {
    text: "text-mw-steel",
    border: "border-mw-steel/40",
    glow: "hover:border-mw-steel hover:shadow-glow-phosphor",
    bg: "bg-mw-steel/10",
    hex: "#7a72c4",
  },
];

export function accentFor(index: number): Accent {
  return ACCENTS[index % ACCENTS.length];
}

/**
 * Acentos por significado, para cuando el color comunica estado y no sólo
 * ritmo visual: un puesto vigente va en amarillo de peligro, uno terminado en
 * fósforo. Elegirlos por nombre deja claro en el código que la decisión no es
 * decorativa.
 */
export const ACCENT_RUST = ACCENTS[0];
export const ACCENT_PHOSPHOR = ACCENTS[1];
export const ACCENT_HAZARD = ACCENTS[2];
export const ACCENT_STEEL = ACCENTS[3];
