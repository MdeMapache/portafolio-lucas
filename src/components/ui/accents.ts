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
};

export const ACCENTS: Accent[] = [
  {
    text: "text-cyber-magenta",
    border: "border-cyber-magenta/40",
    glow: "hover:border-cyber-magenta hover:shadow-neon-magenta",
    bg: "bg-cyber-magenta/10",
  },
  {
    text: "text-cyber-cyan",
    border: "border-cyber-cyan/40",
    glow: "hover:border-cyber-cyan hover:shadow-neon-cyan",
    bg: "bg-cyber-cyan/10",
  },
  {
    text: "text-cyber-lime",
    border: "border-cyber-lime/40",
    glow: "hover:border-cyber-lime hover:shadow-neon-lime",
    bg: "bg-cyber-lime/10",
  },
  {
    text: "text-cyber-violet",
    border: "border-cyber-violet/40",
    glow: "hover:border-cyber-violet hover:shadow-neon-cyan",
    bg: "bg-cyber-violet/10",
  },
];

export function accentFor(index: number): Accent {
  return ACCENTS[index % ACCENTS.length];
}
