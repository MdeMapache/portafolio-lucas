import type { AuthAdapter, Session } from "./auth";

const SESSION_KEY = "portafolio:session";

/**
 * Adapter de auth para desarrollo, sin backend.
 *
 * ⚠️ Esto NO es seguridad. La frase está en el bundle del cliente y la sesión en
 * localStorage: cualquiera con las DevTools abiertas entra. Existe para que el
 * flujo de login/logout sea el mismo con y sin backend, y para poder probarlo.
 *
 * En modo local tampoco hay nada que proteger: los datos viven en el navegador
 * de cada visitante y nadie más los ve. La seguridad de verdad la pone
 * `SupabaseAuthAdapter` junto con las policies RLS del servidor.
 */
export class LocalAuthAdapter implements AuthAdapter {
  readonly kind = "local" as const;

  private listeners = new Set<(session: Session) => void>();

  private get passphrase(): string {
    return process.env.NEXT_PUBLIC_DEV_PASSPHRASE || "dev";
  }

  async getSession(): Promise<Session> {
    if (typeof window === "undefined") return null;

    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as Session;
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  async signIn(email: string, password: string): Promise<Session> {
    if (password !== this.passphrase) {
      throw new Error("Frase incorrecta.");
    }

    const session: Session = { userId: "local-owner", email: email || null };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.emit(session);
    return session;
  }

  async signOut(): Promise<void> {
    window.localStorage.removeItem(SESSION_KEY);
    this.emit(null);
  }

  onChange(callback: (session: Session) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private emit(session: Session) {
    for (const listener of this.listeners) listener(session);
  }
}
