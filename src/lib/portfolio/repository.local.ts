import { cloneDefaults } from "./defaults";
import { IdbAssetStore } from "./assetStore.idb";
import { migrate } from "./migrate";
import type { PortfolioRepository } from "./repository";
import type { PortfolioData } from "./types";

const STORAGE_KEY = "portafolio:data";

/**
 * Adapter de persistencia local: el documento JSON va a localStorage y los
 * binarios a IndexedDB (ver `assetStore.idb.ts`).
 *
 * Es el backend por defecto del MVP: no necesita servidor ni credenciales y
 * sobrevive recargas y cierres del navegador. Su límite es que los datos viven
 * en UN navegador — para que el portafolio se vea igual desde cualquier lado
 * hay que cambiar a un adapter remoto (ver README de la carpeta).
 */
export class LocalRepository implements PortfolioRepository {
  private assets = new IdbAssetStore();

  async load(): Promise<PortfolioData> {
    // Durante el render en servidor no hay localStorage; devolvemos defaults y
    // el provider vuelve a cargar en el cliente.
    if (typeof window === "undefined") return cloneDefaults();

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaults();

    try {
      const parsed = JSON.parse(raw) as Partial<PortfolioData>;
      return migrate(parsed);
    } catch {
      // JSON corrupto: no tiramos la app abajo, arrancamos limpio.
      console.warn("[portafolio] Datos guardados ilegibles, se usan los defaults.");
      return cloneDefaults();
    }
  }

  async save(data: PortfolioData): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      // Cuota llena: el JSON es chico, así que si pasa es por otra cosa.
      console.error("[portafolio] No se pudo guardar en localStorage:", err);
      throw new Error("No se pudo guardar. Puede que el almacenamiento esté lleno.");
    }
  }

  async reset(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
    await this.assets.clear();
  }
}
