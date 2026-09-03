import { DEFAULT_PORTFOLIO } from "./defaults";

/**
 * Lee el perfil desde el servidor, para los metadatos y la imagen de vista
 * previa del enlace.
 *
 * No usa el cliente de Supabase: es una petición REST pelada con la anon key,
 * que es pública por diseño. Alcanza para leer, y evita arrastrar el SDK al
 * bundle del servidor sólo para esto.
 *
 * Siempre devuelve algo. Si Supabase está caído, pausado por inactividad o sin
 * configurar, cae a los defaults: un enlace sin vista previa es feo, pero una
 * página que no compila porque el backend está dormido es mucho peor.
 */

export type ProfileMeta = {
  name: string;
  role: string;
  location: string;
  bio: string;
};

const FALLBACK: ProfileMeta = {
  name: DEFAULT_PORTFOLIO.profile.name,
  role: DEFAULT_PORTFOLIO.profile.role,
  location: DEFAULT_PORTFOLIO.profile.location,
  bio: DEFAULT_PORTFOLIO.profile.bio,
};

/** Corta la espera: los metadatos no valen bloquear la respuesta. */
const TIMEOUT_MS = 4000;

export async function getProfileForMetadata(): Promise<ProfileMeta> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return FALLBACK;

  try {
    const res = await fetch(`${url}/rest/v1/portfolio?select=document&id=eq.1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // Una hora de caché: el perfil cambia poco y así no se consulta la base
      // en cada visita sólo para armar el <head>.
      next: { revalidate: 3600 },
    });

    if (!res.ok) return FALLBACK;

    const rows = (await res.json()) as { document?: { profile?: Partial<ProfileMeta> } }[];
    const profile = rows[0]?.document?.profile;
    if (!profile) return FALLBACK;

    return {
      name: profile.name || FALLBACK.name,
      role: profile.role || FALLBACK.role,
      location: profile.location || FALLBACK.location,
      bio: profile.bio || FALLBACK.bio,
    };
  } catch {
    // Timeout, red caída o proyecto pausado: seguimos con los defaults.
    return FALLBACK;
  }
}

/**
 * URL pública del sitio, para que las etiquetas Open Graph lleven rutas
 * absolutas. Sin esto, las redes no encuentran la imagen de vista previa.
 *
 * Vercel expone el dominio de producción en `VERCEL_PROJECT_PRODUCTION_URL`;
 * en local no existe ninguna de las dos y usamos localhost.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
