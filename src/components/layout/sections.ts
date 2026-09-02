/**
 * Definición única de las secciones navegables.
 *
 * La usan el Sidebar (para pintar el menú) y el SectionRouter (para decidir
 * qué panel montar), así que agregar una sección es tocar sólo este archivo
 * más su componente.
 */
export const SECTIONS = [
  { id: "perfil", label: "Perfil", code: "01", hint: "Identidad y stack" },
  { id: "proyectos", label: "Proyectos", code: "02", hint: "Repositorios y avance" },
  { id: "demos", label: "Demos", code: "03", hint: "Apps en vivo" },
  { id: "trayectoria", label: "Trayectoria", code: "04", hint: "Experiencia y formación" },
  { id: "habilidades", label: "Habilidades", code: "05", hint: "Dominio y certificaciones" },
  { id: "contacto", label: "Contacto", code: "06", hint: "Canales abiertos" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const DEFAULT_SECTION: SectionId = "perfil";

/** Valida un id que viene de fuera (hash de la URL, localStorage). */
export function isSectionId(value: string): value is SectionId {
  return SECTIONS.some((s) => s.id === value);
}
