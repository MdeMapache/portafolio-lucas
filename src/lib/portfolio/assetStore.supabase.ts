import { getSupabase } from "@/lib/supabase";
import type { AssetStore } from "./repository";
import type { AssetId } from "./types";

const BUCKET = "assets";

/** Extensión a partir del MIME, para que el archivo se sirva bien. */
function extensionFor(type: string): string {
  const map: Record<string, string> = {
    "image/gif": "gif",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
  };
  return map[type] ?? "bin";
}

/**
 * Binarios en Supabase Storage.
 *
 * El `AssetId` acá es la ruta del archivo dentro del bucket. Sigue siendo un
 * string opaco para el resto de la app, igual que el id generado del adapter
 * local: por eso el mismo documento funciona con los dos backends.
 *
 * El bucket es de lectura pública (el portafolio se ve sin login) y de escritura
 * sólo autenticada. Eso lo imponen las policies, no este código.
 */
export class SupabaseAssetStore implements AssetStore {
  async put(file: Blob): Promise<AssetId> {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase no está configurado.");

    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extensionFor(file.type)}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (error) {
      console.error("[portafolio] Error al subir a Storage:", error.message);
      throw new Error("No se pudo subir el archivo.");
    }

    return path;
  }

  async getUrl(id: AssetId): Promise<string | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(id);

    return publicUrl ?? null;
  }

  /**
   * No hace nada a propósito: las URL públicas de Storage son permanentes, no
   * object URL. El método existe porque el adapter local sí necesita revocarlas.
   */
  release(): void {}

  async delete(id: AssetId): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase.storage.from(BUCKET).remove([id]);
    if (error) {
      // Un archivo huérfano no rompe nada; no vale la pena tirar la operación.
      console.warn("[portafolio] No se pudo borrar del Storage:", error.message);
    }
  }
}
