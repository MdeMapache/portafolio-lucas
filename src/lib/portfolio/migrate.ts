import { cloneDefaults } from "./defaults";
import { SCHEMA_VERSION, type PortfolioData, type Project } from "./types";

/**
 * Lleva un documento guardado a la forma actual del esquema.
 *
 * Vivía duplicado en los dos adapters de persistencia, y ya había empezado a
 * divergir: agregar un campo obligaba a acordarse de tocar los dos archivos.
 *
 * La regla es completar antes que descartar: perder los datos del usuario es
 * peor que un campo nuevo en su valor por defecto.
 */

/**
 * Rellena los campos que un proyecto viejo no tenía.
 *
 * Hace falta porque `saved.projects` se usa entero: si el documento guardado es
 * anterior a un campo, los objetos de adentro llegan sin él y el componente que
 * los recorre revienta al mapear sobre `undefined`.
 */
function normalizeProject(project: Partial<Project>): Project {
  return {
    id: project.id ?? `pr-${Math.random().toString(36).slice(2, 10)}`,
    icon: project.icon ?? "📦",
    title: project.title ?? "",
    description: project.description ?? "",
    longDescription: project.longDescription ?? "",
    lastCommit: project.lastCommit ?? "",
    done: project.done ?? 0,
    total: project.total ?? 1,
    demoUrl: project.demoUrl ?? null,
    repoUrl: project.repoUrl ?? null,
    tech: project.tech ?? [],
    screenshotAssetIds: project.screenshotAssetIds ?? [],
    controls: project.controls ?? [],
    cheats: project.cheats ?? [],
    featured: project.featured ?? false,
  };
}

export function migrate(saved: Partial<PortfolioData>): PortfolioData {
  const defaults = cloneDefaults();

  return {
    version: SCHEMA_VERSION,
    profile: { ...defaults.profile, ...saved.profile },
    background: saved.background ?? defaults.background,
    cvAssetId: saved.cvAssetId ?? defaults.cvAssetId,
    projects: saved.projects ? saved.projects.map(normalizeProject) : defaults.projects,
    experience: saved.experience ?? defaults.experience,
    education: saved.education ?? defaults.education,
    languages: saved.languages ?? defaults.languages,
    skills: saved.skills ?? defaults.skills,
    techBadges: saved.techBadges ?? defaults.techBadges,
    groups: saved.groups ?? defaults.groups,
    contacts: saved.contacts ?? defaults.contacts,
    certifications: saved.certifications ?? defaults.certifications,
    stats: saved.stats ?? defaults.stats,
  };
}
