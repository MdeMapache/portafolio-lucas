import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase, creado de forma perezosa.
 *
 * Antes esto usaba `process.env.X!` a nivel de módulo, así que el sólo hecho de
 * importarlo sin las variables configuradas reventaba la app. Ahora si no hay
 * credenciales devuelve `null` y la app cae al backend local, que es lo que
 * queremos: el portafolio tiene que funcionar sin backend.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** true si hay credenciales con pinta de válidas. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey && url.startsWith("http"));
}

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  client ??= createClient(url as string, anonKey as string, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return client;
}
