import { DEFAULT_BACKGROUND_ID } from "./backgrounds";
import { SCHEMA_VERSION, type PortfolioData } from "./types";

/**
 * Estado inicial del portafolio.
 *
 * Se usa la primera vez que se abre el sitio (cuando todavía no hay nada
 * guardado) y cuando el usuario aprieta "Restablecer" en el panel de edición.
 * Los datos salen del CV real y de la maqueta original estilo Steam.
 */
export const DEFAULT_PORTFOLIO: PortfolioData = {
  version: SCHEMA_VERSION,

  profile: {
    name: "Mapache",
    role: "Desarrollador Frontend & Game Dev",
    location: "Quilpué, Chile",
    level: 18,
    tags: ["HTML / CSS / JS", "ANGULAR + IONIC", "GODOT", "TYPESCRIPT"],
    bio: "Ingeniero Informático (Duoc UC) con foco en desarrollo Full-Stack, móvil y videojuegos. Cursando un diplomado en Ciberseguridad. Me gusta el código limpio, la arquitectura modular y aprender herramientas nuevas.",
    avatarAssetId: null,
    availableForWork: true,
  },

  background: { kind: "preset", presetId: DEFAULT_BACKGROUND_ID },

  cvAssetId: null,

  projects: [
    {
      id: "godot-runner",
      icon: "🕹️",
      title: "Juego 2D Android — Godot",
      description: "Videojuego 2D para Android en Godot Engine (GDScript).",
      longDescription:
        "Ciclo completo de implementación: mecánicas de jugador con controles táctiles y analógicos optimizados para móvil, sistema de combate con proyectiles y object pooling para cuidar el rendimiento en Android, IA de enemigos terrestres y voladores, cámara con mira estilo sniper, HUD de vida y UI de pausa adaptada a pantalla táctil, y shaders personalizados. Arquitectura modular por sistemas (player, enemies, world, ui) bajo control de versiones con commits incrementales.",
      lastCommit: "hoy",
      done: 32,
      total: 40,
      demoUrl: null,
      repoUrl: null,
      tech: ["Godot", "GDScript", "Android"],
      screenshotAssetIds: [],
      featured: true,
    },
    {
      id: "ionic-gestion",
      icon: "📱",
      title: "App de gestión — Ionic + Angular",
      description: "App híbrida con autenticación y backend en la nube.",
      longDescription:
        "Aplicación híbrida multiplataforma construida con Ionic y Angular: autenticación de usuarios, persistencia remota, notificaciones push y vistas responsivas pensadas para uso en móvil.",
      lastCommit: "hace 2 días",
      done: 18,
      total: 25,
      demoUrl: null,
      repoUrl: null,
      tech: ["Angular", "Ionic", "TypeScript"],
      screenshotAssetIds: [],
      featured: false,
    },
    {
      id: "portafolio-web",
      icon: "🌐",
      title: "Portafolio — Next.js",
      description: "Este mismo sitio: perfil estilo Steam, editable y persistente.",
      longDescription:
        "Portafolio personal construido con Next.js (App Router), TypeScript y Tailwind CSS, con la estética de un perfil de Steam. Incluye panel de administración para editar perfil, stack, proyectos y fondo animado, con una capa de persistencia intercambiable.",
      lastCommit: "hace 5 días",
      done: 10,
      total: 10,
      demoUrl: null,
      repoUrl: null,
      tech: ["Next.js", "TypeScript", "Tailwind"],
      screenshotAssetIds: [],
      featured: false,
    },
  ],

  skills: [
    { id: "sk-js", name: "JavaScript", level: 85 },
    { id: "sk-ng", name: "Angular / Ionic", level: 70 },
    { id: "sk-ts", name: "TypeScript", level: 60 },
    { id: "sk-godot", name: "Godot / GDScript", level: 55 },
    { id: "sk-flutter", name: "Flutter / Dart", level: 45 },
  ],

  techBadges: [
    { id: "tb-js", label: "JS", level: 5 },
    { id: "tb-ts", label: "TS", level: 4 },
    { id: "tb-ng", label: "NG", level: 4 },
    { id: "tb-ion", label: "ION", level: 3 },
    { id: "tb-gd", label: "GD", level: 3 },
    { id: "tb-css", label: "CSS", level: 4 },
    { id: "tb-git", label: "GIT", level: 3 },
    { id: "tb-sql", label: "SQL", level: 2 },
  ],

  groups: [
    {
      id: "gr-duoc",
      icon: "🎓",
      name: "Duoc UC",
      sub: "Ingeniería Informática · 2019–2025",
      url: null,
    },
    {
      id: "gr-ciber",
      icon: "🛡️",
      name: "Diplomado en Ciberseguridad",
      sub: "Duoc · desde oct. 2025",
      url: null,
    },
    { id: "gr-terraria", icon: "🌱", name: "Terraria Chile", sub: "668 miembros", url: null },
  ],

  contacts: [
    {
      id: "ct-gh",
      code: "GH",
      name: "github.com/MdeMapache",
      role: "Repositorios",
      url: "https://github.com/MdeMapache",
      online: true,
    },
    {
      id: "ct-in",
      code: "IN",
      name: "linkedin.com/in/lucas-andres-figueroa-jofre-b85353234",
      role: "Perfil profesional",
      url: "https://www.linkedin.com/in/lucas-andres-figueroa-jofre-b85353234",
      online: true,
    },
    {
      id: "ct-ig",
      code: "IG",
      name: "instagram.com/luca.lfj",
      role: "Instagram",
      url: "https://www.instagram.com/luca.lfj/",
      online: true,
    },
    {
      id: "ct-mail",
      code: "@",
      name: "lucas.figueroaj@gmail.com",
      role: "Correo",
      url: "mailto:lucas.figueroaj@gmail.com",
      online: false,
    },
  ],

  stats: [
    { id: "st-proyectos", num: 3, label: "Proyectos" },
    { id: "st-produccion", num: 1, label: "En producción" },
    { id: "st-cert", num: 1, label: "Certificaciones" },
    { id: "st-progreso", num: 2, label: "En progreso" },
  ],
};

/** Copia profunda, para no mutar la constante al restablecer. */
export function cloneDefaults(): PortfolioData {
  return structuredClone(DEFAULT_PORTFOLIO);
}
