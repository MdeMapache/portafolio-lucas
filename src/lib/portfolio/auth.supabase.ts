import { getSupabase } from "@/lib/supabase";
import type { AuthAdapter, Session } from "./auth";

/**
 * Auth real, contra Supabase Auth.
 *
 * El modelo es de un solo dueño: cualquier usuario autenticado puede escribir,
 * y como los registros están deshabilitados en el panel de Supabase, el único
 * usuario que existe sos vos. Eso mantiene las policies RLS simples
 * ("authenticated puede escribir") sin hardcodear un email en la base.
 *
 * Ojo: esconder los botones de edición NO es la protección. La protección son
 * las policies del lado del servidor — ver `supabase-setup.sql`.
 */
export class SupabaseAuthAdapter implements AuthAdapter {
  readonly kind = "supabase" as const;

  async getSession(): Promise<Session> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null;

    return {
      userId: data.session.user.id,
      email: data.session.user.email ?? null,
    };
  }

  async signIn(email: string, password: string): Promise<Session> {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase no está configurado.");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // No distinguimos "usuario inexistente" de "contraseña incorrecta": decirlo
      // permitiría averiguar qué emails están registrados.
      throw new Error("Email o contraseña incorrectos.");
    }

    return { userId: data.user.id, email: data.user.email ?? null };
  }

  async signOut(): Promise<void> {
    await getSupabase()?.auth.signOut();
  }

  onChange(callback: (session: Session) => void): () => void {
    const supabase = getSupabase();
    if (!supabase) return () => {};

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(
        session ? { userId: session.user.id, email: session.user.email ?? null } : null,
      );
    });

    return () => data.subscription.unsubscribe();
  }
}
