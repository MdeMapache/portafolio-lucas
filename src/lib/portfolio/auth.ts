/**
 * Contrato de autenticación.
 *
 * Mismo patrón que `PortfolioRepository`: la app pregunta "¿quién sos?" a esta
 * interfaz y nunca a un proveedor concreto. Hoy la implementan un adapter local
 * (para desarrollo) y uno de Supabase (el real).
 */

export type Session = {
  userId: string;
  email: string | null;
} | null;

export interface AuthAdapter {
  /** Sesión actual, o null si no hay nadie autenticado. */
  getSession(): Promise<Session>;
  signIn(email: string, password: string): Promise<Session>;
  signOut(): Promise<void>;
  /** Se suscribe a cambios de sesión. Devuelve la función para desuscribirse. */
  onChange(callback: (session: Session) => void): () => void;
  /**
   * Texto para la pantalla de login, distinto según el adapter: en local hay
   * que aclarar que no es seguridad real.
   */
  readonly kind: "local" | "supabase";
}
