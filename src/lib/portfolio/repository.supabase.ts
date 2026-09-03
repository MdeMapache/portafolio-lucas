import { getSupabase } from "@/lib/supabase";
import { cloneDefaults } from "./defaults";
import { migrate } from "./migrate";
import type { PortfolioRepository } from "./repository";
import type { PortfolioData } from "./types";

/** Fila única de la tabla `portfolio`. Ver `supabase-setup.sql`. */
const ROW_ID = 1;

/**
 * Persistencia del documento en Supabase (Postgres).
 *
 * Guarda todo el documento como un `jsonb` en una sola fila. Es deliberado:
 * el portafolio se lee y se escribe entero, nunca por partes, así que
 * normalizarlo en tablas separadas sólo agregaría joins sin ganar nada.
 *
 * La escritura la corta RLS, no este código: con la sesión anónima el `update`
 * falla del lado del servidor. Ver `supabase-setup.sql`.
 */
export class SupabaseRepository implements PortfolioRepository {
  async load(): Promise<PortfolioData> {
    const supabase = getSupabase();
    if (!supabase) return cloneDefaults();

    const { data, error } = await supabase
      .from("portfolio")
      .select("document")
      .eq("id", ROW_ID)
      .maybeSingle();

    if (error) {
      console.error("[portafolio] Error al leer de Supabase:", error.message);
      throw new Error("No se pudo leer el portafolio del servidor.");
    }

    // Primera vez: la fila todavía no existe, arrancamos de los defaults.
    if (!data?.document) return cloneDefaults();

    return migrate(data.document as Partial<PortfolioData>);
  }

  async save(data: PortfolioData): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase no está configurado.");

    // upsert para que la primera escritura cree la fila sin un paso aparte.
    const { error } = await supabase
      .from("portfolio")
      .upsert({ id: ROW_ID, document: data, updated_at: new Date().toISOString() });

    if (error) {
      console.error("[portafolio] Error al guardar en Supabase:", error.message);
      // El caso normal acá es no tener sesión: RLS rechaza la escritura.
      throw new Error(
        error.message.includes("row-level security")
          ? "No tenés permiso para guardar. Iniciá sesión."
          : "No se pudo guardar en el servidor.",
      );
    }
  }

  async reset(): Promise<void> {
    await this.save(cloneDefaults());
  }
}
