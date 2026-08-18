export const profile = {
  name: "Mapache",
  role: "Desarrollador Frontend & Game Dev · Chile",
  level: 6,
  tags: ["HTML / CSS / JS", "ANGULAR + IONIC", "GODOT", "TYPESCRIPT"],
};

export const showcase = [
  { icon: "🕹️", label: "Godot" },
  { icon: "📱", label: "Ionic/Angular" },
  { icon: "🌐", label: "JS Vanilla" },
  { icon: "⚙️", label: "TypeScript" },
];

export const stats = [
  { num: 12, label: "Proyectos" },
  { num: 4, label: "En producción" },
  { num: 3, label: "Certificaciones" },
  { num: 2, label: "En progreso" },
];

export type Project = {
  icon: string;
  title: string;
  lastCommit: string;
  description: string;
  done: number;
  total: number;
};

export const projects: Project[] = [
  {
    icon: "🕹️",
    title: "Runner 2D — Godot",
    lastCommit: "hoy",
    description:
      "Juego de plataformas con sistema de físicas y niveles procedurales.",
    done: 32,
    total: 40,
  },
  {
    icon: "📱",
    title: "App de gestión — Ionic + Angular",
    lastCommit: "hace 2 días",
    description:
      "App híbrida con autenticación, backend en Supabase y notificaciones push.",
    done: 18,
    total: 25,
  },
  {
    icon: "🌐",
    title: "Sitio portafolio — HTML/CSS/JS",
    lastCommit: "hace 5 días",
    description:
      "Landing personal responsiva con animaciones y formulario de contacto.",
    done: 10,
    total: 10,
  },
];

export const skills = [
  { name: "JavaScript", level: 85 },
  { name: "Angular / Ionic", level: 70 },
  { name: "Godot / GDScript", level: 55 },
  { name: "TypeScript", level: 60 },
];

export const techBadges = [
  { label: "JS", level: 5 },
  { label: "TS", level: 4 },
  { label: "NG", level: 4 },
  { label: "ION", level: 3 },
  { label: "GD", level: 3 },
  { label: "CSS", level: 4 },
  { label: "GIT", level: 3 },
  { label: "SQL", level: 2 },
];

export const groups = [{ icon: "🌱", name: "Terraria Chile", sub: "668 miembros" }];

export const contacts = [
  { code: "GH", name: "github.com/mapache", role: "Repositorios", online: true },
  { code: "IN", name: "linkedin.com/in/mapache", role: "Perfil profesional", online: true },
  { code: "@", name: "contacto@mapache.dev", role: "Correo", online: false },
];
