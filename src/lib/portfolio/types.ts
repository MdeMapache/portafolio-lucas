/**
 * Modelo de dominio del portafolio.
 *
 * Todo lo que el usuario puede editar desde el panel "Modificar perfil" vive
 * acá. La forma es deliberadamente plana y serializable a JSON: cualquier
 * backend (localStorage, Supabase, MongoDB) puede guardarla tal cual.
 *
 * Los binarios (avatar, fondo GIF, CV, capturas) NO se guardan acá. Se guardan
 * en un `AssetStore` aparte y el documento sólo referencia su `AssetId`. Eso
 * mantiene el JSON chico y permite que cada backend elija cómo almacenar blobs.
 */

/** Referencia a un binario guardado en el `AssetStore`. */
export type AssetId = string;

export type Profile = {
  name: string;
  role: string;
  location: string;
  /** Nivel estilo Steam, decorativo. */
  level: number;
  /** Chips bajo el nombre, ej. "ANGULAR + IONIC". */
  tags: string[];
  bio: string;
  avatarAssetId: AssetId | null;
  availableForWork: boolean;
};

/**
 * Fondo del perfil, al estilo de los "Fondos Animados" de Steam.
 * `preset` referencia el catálogo estático; `custom` referencia un GIF/imagen
 * que el usuario subió.
 */
export type BackgroundChoice =
  | { kind: "preset"; presetId: string }
  | { kind: "custom"; assetId: AssetId };

export type Project = {
  id: string;
  icon: string;
  title: string;
  /** Resumen de una línea, se ve en la tarjeta. */
  description: string;
  /** Texto largo, se ve al expandir. */
  longDescription: string;
  lastCommit: string;
  done: number;
  total: number;
  demoUrl: string | null;
  repoUrl: string | null;
  tech: string[];
  screenshotAssetIds: AssetId[];
  /** Sólo uno queda destacado; el repositorio se encarga de mantener la unicidad. */
  featured: boolean;
};

/**
 * Un puesto de trabajo.
 *
 * `end: null` significa "sigue vigente" y la interfaz lo pinta como
 * *Actualmente*. Guardar el null en vez del texto permite ordenar y destacar
 * los puestos activos sin tener que adivinar leyendo una cadena.
 *
 * Las tareas van en `highlights` y no en un párrafo: en el CV son viñetas, y
 * apelmazarlas en prosa hace que no las lea nadie.
 */
export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  /** Texto libre tal como se muestra, ej. "May. 2025". */
  start: string;
  end: string | null;
  /** Una línea que resume el puesto. Puede ir vacía. */
  summary: string;
  highlights: string[];
};

/** Formación formal. Misma convención que `Experience` para `end`. */
export type Education = {
  id: string;
  title: string;
  institution: string;
  location: string;
  start: string;
  end: string | null;
};

/** `level` es texto libre ("Intermedio", "B2"); vacío = sin declarar. */
export type Language = { id: string; name: string; level: string };

export type Skill = { id: string; name: string; level: number };
export type TechBadge = { id: string; label: string; level: number };
export type Group = { id: string; icon: string; name: string; sub: string; url: string | null };
export type Contact = {
  id: string;
  code: string;
  name: string;
  role: string;
  url: string | null;
  online: boolean;
};
export type Stat = { id: string; num: number; label: string };

/** Certificación formal. El emisor y el año se muestran como subtítulo. */
export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type PortfolioData = {
  /** Se incrementa cuando cambia la forma del documento, para migraciones. */
  version: number;
  profile: Profile;
  background: BackgroundChoice;
  cvAssetId: AssetId | null;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  languages: Language[];
  skills: Skill[];
  techBadges: TechBadge[];
  groups: Group[];
  contacts: Contact[];
  certifications: Certification[];
  stats: Stat[];
};

/**
 * Versión actual del esquema. Subila al hacer cambios incompatibles.
 *
 * v2: se agregan `experience`, `education` e `languages`, que salen del CV.
 * Los documentos v1 no las traen; `migrate()` las completa con los defaults.
 */
export const SCHEMA_VERSION = 2;
