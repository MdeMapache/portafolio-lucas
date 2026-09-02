import type { AssetId, PortfolioData } from "./types";

/**
 * Contrato de persistencia del portafolio.
 *
 * Toda la app habla con esta interfaz y nunca con un backend concreto. Hoy la
 * implementa `LocalRepository` (localStorage + IndexedDB). Para pasar a una base
 * real sólo hay que escribir otra clase que cumpla esta misma forma y cambiarla
 * en `src/lib/portfolio/index.ts` — ningún componente se entera.
 */
export interface PortfolioRepository {
  /** Devuelve el documento guardado, o los defaults si todavía no hay nada. */
  load(): Promise<PortfolioData>;
  /** Persiste el documento completo. */
  save(data: PortfolioData): Promise<void>;
  /** Borra todo lo guardado y vuelve a los defaults. */
  reset(): Promise<void>;
}

/**
 * Almacén de binarios: avatares, fondos animados (GIF), CV en PDF y capturas.
 *
 * Va separado del repositorio porque casi todos los backends reales tratan
 * "documento" y "archivo" como servicios distintos (Postgres + Storage,
 * MongoDB + Cloudinary, etc.). Mantenerlos separados hace que ese salto sea
 * mecánico.
 */
export interface AssetStore {
  /** Guarda un archivo y devuelve el id con el que referenciarlo. */
  put(file: Blob): Promise<AssetId>;
  /**
   * Devuelve una URL usable en `src`. Puede ser una object URL efímera (local)
   * o una URL pública y permanente (Supabase/Cloudinary), así que quien la use
   * debe liberarla con `release`.
   */
  getUrl(id: AssetId): Promise<string | null>;
  /** Libera la URL devuelta por `getUrl`, si el backend lo necesita. */
  release(url: string): void;
  delete(id: AssetId): Promise<void>;
}
