import { isSupabaseConfigured } from "@/lib/supabase";
import { IdbAssetStore } from "./assetStore.idb";
import { SupabaseAssetStore } from "./assetStore.supabase";
import { LocalAuthAdapter } from "./auth.local";
import { SupabaseAuthAdapter } from "./auth.supabase";
import { LocalRepository } from "./repository.local";
import { SupabaseRepository } from "./repository.supabase";
import type { AuthAdapter } from "./auth";
import type { AssetStore, PortfolioRepository } from "./repository";

/**
 * Punto único donde se elige el backend.
 *
 * La decisión la toman las variables de entorno: si hay credenciales de
 * Supabase válidas, se usa el backend remoto; si no, el local. Así el
 * portafolio funciona sin configurar nada, y pasa a modo remoto con sólo
 * completar `.env.local` — sin tocar una línea de componente.
 */

export type BackendMode = "local" | "supabase";

export function getBackendMode(): BackendMode {
  return isSupabaseConfigured() ? "supabase" : "local";
}

let repository: PortfolioRepository | null = null;
let assetStore: AssetStore | null = null;
let auth: AuthAdapter | null = null;

export function getRepository(): PortfolioRepository {
  repository ??= isSupabaseConfigured() ? new SupabaseRepository() : new LocalRepository();
  return repository;
}

export function getAssetStore(): AssetStore {
  assetStore ??= isSupabaseConfigured() ? new SupabaseAssetStore() : new IdbAssetStore();
  return assetStore;
}

export function getAuth(): AuthAdapter {
  auth ??= isSupabaseConfigured() ? new SupabaseAuthAdapter() : new LocalAuthAdapter();
  return auth;
}

export * from "./types";
export * from "./repository";
export * from "./auth";
export * from "./backgrounds";
export { DEFAULT_PORTFOLIO, cloneDefaults } from "./defaults";
