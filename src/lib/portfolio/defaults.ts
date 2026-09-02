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
    bio: "Ingeniero Informático (Duoc UC) con foco en desarrollo Full-Stack, móvil y videojuegos, con un diplomado en Ciberseguridad. Me gusta el código limpio, la arquitectura modular y aprender herramientas nuevas.",
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
      id: "tavern-quest",
      icon: "🍺",
      title: "TavernQuest — Flutter + Firebase",
      description: "Gestor de tareas gamificado con tema de taberna medieval.",
      longDescription:
        "App Android en Flutter con Clean Architecture (data / domain / presentation), inyección de dependencias con get_it y backend Firebase: Auth con Google Sign-In, Cloud Firestore y notificaciones locales programadas. Las tareas son \"contratos\" con categoría, fases, fecha límite y dificultad, que otorgan oro y experiencia; hay un Mini Boss al que se le hace daño completando contratos, una racha diaria que se reinicia a medianoche y una tienda de objetos. El proyecto se perdió y sólo sobrevivió el APK: como el build no estaba ofuscado, del binario se recuperaron la estructura, los nombres de clases y métodos, los textos y los assets. El demo en vivo es una recreación web de esa app a partir de lo recuperado, sin dependencias.",
      lastCommit: "hace 1 día",
      done: 24,
      total: 24,
      demoUrl: "/demos/tavern-quest/index.html",
      repoUrl: null,
      tech: ["Flutter", "Dart", "Firebase"],
      screenshotAssetIds: [],
      featured: false,
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

  // Experiencia laboral del CV, en orden: primero lo vigente, después lo
  // terminado. Los textos son los del currículum, recortados a lo que se lee
  // bien en pantalla; no se agregó ninguna responsabilidad que no esté ahí.
  experience: [
    {
      id: "exp-mitsoft",
      role: "Desarrollador",
      company: "Mitsoft",
      location: "Quilpué, Chile",
      start: "May. 2026",
      end: null,
      summary: "Videojuego 2D para Android en Godot Engine (GDScript).",
      highlights: [
        "Mecánicas de jugador con controles táctiles y analógicos optimizados para móvil.",
        "Sistema de combate con proyectiles y object pooling para sostener el rendimiento en Android.",
        "IA de enemigos terrestres y voladores.",
        "Cámara con mira estilo sniper, HUD de vida y UI de pausa adaptada a pantalla táctil.",
        "Shaders personalizados para efectos visuales.",
        "Control de versiones con Git y arquitectura modular por sistemas (player, enemies, world, ui).",
      ],
    },
    {
      id: "exp-abeja",
      role: "Soporte TI",
      company: "Transportes Abeja Propiedades",
      location: "Santiago, Chile",
      start: "Feb. 2025",
      end: null,
      summary: "Soporte tecnológico y optimización de procesos de forma periódica.",
      highlights: [
        "Diagnóstico, mantenimiento correctivo y recambio de equipos para asegurar la continuidad operativa.",
        "Mesa de ayuda remota: resolución de incidencias y asistencia a usuarios vía TeamViewer.",
        "Automatización de tareas operativas y administrativas de la empresa.",
      ],
    },
    {
      id: "exp-crazy",
      role: "Desarrollador web",
      company: "Crazy Family",
      location: "Santiago, Chile",
      start: "May. 2025",
      end: "Sep. 2025",
      summary: "Frontend, UX/UI y gestión de sitios en WordPress.",
      highlights: [
        "Maquetación web responsive (HTML semántico, CSS, JS) centrada en accesibilidad.",
        "Creación y mantención de sitios en WordPress con Elementor y plugins a medida.",
        "SEO, administración de catálogos digitales y mantenimiento de bases de datos.",
        "Aplicación de conceptos de seguridad web en la construcción de los sitios.",
        "Coordinación con los equipos de diseño, marketing y logística.",
      ],
    },
  ],

  education: [
    {
      id: "edu-diplomado",
      title: "Diplomado en Ciberseguridad",
      institution: "Duoc UC",
      location: "Viña del Mar, Chile",
      start: "Oct. 2025",
      end: "2026",
    },
    {
      id: "edu-ingenieria",
      title: "Ingeniería Informática",
      institution: "Duoc UC",
      location: "Viña del Mar, Chile",
      start: "Mar. 2019",
      end: "Ago. 2025",
    },
  ],

  // El CV lista "Inglés" sin declarar nivel; se deja vacío en vez de inventar
  // uno. La interfaz muestra el hueco para que se complete desde el panel.
  languages: [
    { id: "lang-es", name: "Español", level: "Nativo" },
    { id: "lang-en", name: "Inglés", level: "" },
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
      sub: "Duoc · 2025–2026",
      url: null,
    },
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

  // Certificaciones del currículum de Ingeniería en Informática, Duoc UC.
  // El certificado que las acredita lleva C.I. e ID de validación: no van acá,
  // son datos personales que no corresponden en un sitio público.
  certifications: [
    { id: "cert-arq", name: "Arquitectura de Software", issuer: "Duoc UC", year: "2026" },
    { id: "cert-prog", name: "Programación de Software", issuer: "Duoc UC", year: "2026" },
    {
      id: "cert-datos",
      name: "Análisis y Desarrollo de Modelos de Datos",
      issuer: "Duoc UC",
      year: "2026",
    },
    { id: "cert-calidad", name: "Calidad de Software", issuer: "Duoc UC", year: "2026" },
    { id: "cert-bi", name: "Inteligencia de Negocios", issuer: "Duoc UC", year: "2026" },
    {
      id: "cert-proyectos",
      name: "Gestión de Proyectos Informáticos",
      issuer: "Duoc UC",
      year: "2026",
    },
    {
      id: "cert-requerimientos",
      name: "Análisis y Planificación de Requerimientos Informáticos",
      issuer: "Duoc UC",
      year: "2026",
    },
    {
      id: "cert-internacional",
      name: "Certificado Internacional — Nivel Intermedio",
      issuer: "Duoc UC",
      year: "2026",
    },
  ],

  stats: [
    { id: "st-proyectos", num: 3, label: "Proyectos" },
    { id: "st-produccion", num: 1, label: "En producción" },
    { id: "st-cert", num: 8, label: "Certificaciones" },
    { id: "st-progreso", num: 2, label: "En progreso" },
  ],
};

/** Copia profunda, para no mutar la constante al restablecer. */
export function cloneDefaults(): PortfolioData {
  return structuredClone(DEFAULT_PORTFOLIO);
}
