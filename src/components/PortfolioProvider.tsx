"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getAssetStore, getRepository } from "@/lib/portfolio";
import { cloneDefaults } from "@/lib/portfolio/defaults";
import type { AssetId, PortfolioData } from "@/lib/portfolio/types";

type PortfolioContextValue = {
  data: PortfolioData;
  /** false hasta que terminó de leer del almacenamiento en el cliente. */
  ready: boolean;
  saving: boolean;
  error: string | null;
  /** Aplica un parche al documento y lo persiste. */
  update: (patch: Partial<PortfolioData>) => Promise<void>;
  /** Sube un binario y devuelve su id, o null si falló. */
  uploadAsset: (file: Blob) => Promise<AssetId | null>;
  deleteAsset: (id: AssetId) => Promise<void>;
  reset: () => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  // Arrancamos con los defaults para que el HTML del servidor y el primer
  // render del cliente coincidan; la lectura real ocurre en el efecto de abajo.
  const [data, setData] = useState<PortfolioData>(() => cloneDefaults());
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Espejo del estado actual. `update` lo necesita para calcular el documento
  // nuevo sin depender del updater de `setData`, que en StrictMode corre dos
  // veces y no garantiza haber corrido antes de la línea siguiente.
  const dataRef = useRef(data);

  useEffect(() => {
    let cancelled = false;

    getRepository()
      .load()
      .then((loaded) => {
        if (cancelled) return;
        setData(loaded);
        dataRef.current = loaded;
      })
      .catch((err) => {
        console.error("[portafolio] Error al cargar:", err);
        if (!cancelled) setError("No se pudieron cargar los datos guardados.");
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(async (patch: Partial<PortfolioData>) => {
    setSaving(true);
    setError(null);

    // Guardamos el estado previo para revertir si falla la escritura.
    const previous = dataRef.current;
    const next = { ...previous, ...patch };

    setData(next);
    dataRef.current = next;

    try {
      await getRepository().save(next);
    } catch (err) {
      console.error("[portafolio] Error al guardar:", err);
      setData(previous);
      dataRef.current = previous;
      setError(err instanceof Error ? err.message : "No se pudo guardar el cambio.");
    } finally {
      setSaving(false);
    }
  }, []);

  const uploadAsset = useCallback(async (file: Blob): Promise<AssetId | null> => {
    try {
      return await getAssetStore().put(file);
    } catch (err) {
      console.error("[portafolio] Error al subir el archivo:", err);
      setError("No se pudo guardar el archivo. Puede que no haya espacio.");
      return null;
    }
  }, []);

  const deleteAsset = useCallback(async (id: AssetId) => {
    try {
      await getAssetStore().delete(id);
    } catch (err) {
      // Un binario huérfano no rompe nada, así que sólo lo registramos.
      console.warn("[portafolio] No se pudo borrar el archivo:", err);
    }
  }, []);

  const reset = useCallback(async () => {
    await getRepository().reset();
    const fresh = cloneDefaults();
    setData(fresh);
    dataRef.current = fresh;
    setError(null);
  }, []);

  const value = useMemo<PortfolioContextValue>(
    () => ({ data, ready, saving, error, update, uploadAsset, deleteAsset, reset }),
    [data, ready, saving, error, update, uploadAsset, deleteAsset, reset],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio debe usarse dentro de <PortfolioProvider>");
  return ctx;
}

/**
 * Resuelve un `AssetId` a una URL usable en `src`, y la libera al desmontar.
 *
 * Guarda el id junto a la URL para poder descartar una URL vieja durante el
 * render, en vez de limpiarla con un setState síncrono dentro del efecto
 * (que dispara renders en cascada).
 *
 * Las object URL de IndexedDB no se liberan solas: sin el `release` del cleanup
 * cada cambio de avatar o de fondo dejaría un blob colgado en memoria.
 */
export function useAssetUrl(assetId: AssetId | null | undefined): string | null {
  const [resolved, setResolved] = useState<{ assetId: AssetId; url: string } | null>(null);

  useEffect(() => {
    if (!assetId) return;

    let cancelled = false;
    let created: string | null = null;
    const store = getAssetStore();

    store
      .getUrl(assetId)
      .then((url) => {
        if (cancelled) {
          if (url) store.release(url);
          return;
        }
        if (!url) return;
        created = url;
        setResolved({ assetId, url });
      })
      .catch((err) => console.warn("[portafolio] No se pudo leer el archivo:", err));

    return () => {
      cancelled = true;
      if (created) store.release(created);
    };
  }, [assetId]);

  // Si el id cambió y todavía no llegó la URL nueva, no mostramos la anterior.
  return resolved && resolved.assetId === assetId ? resolved.url : null;
}
