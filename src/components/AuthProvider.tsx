"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getAuth, getBackendMode, type BackendMode } from "@/lib/portfolio";
import type { Session } from "@/lib/portfolio/auth";

type AuthContextValue = {
  session: Session;
  /** false hasta que se resolvió la sesión inicial. */
  ready: boolean;
  /** Si puede editar. Con un solo dueño, equivale a tener sesión. */
  isOwner: boolean;
  backend: BackendMode;
  /** "local" avisa en la UI que el login no es seguridad real. */
  authKind: "local" | "supabase";
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const auth = getAuth();

    auth
      .getSession()
      .then((current) => {
        if (!cancelled) setSession(current);
      })
      .catch((err) => console.error("[portafolio] Error al leer la sesión:", err))
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    // El backend puede cerrar la sesión por su cuenta (token vencido, logout en
    // otra pestaña), así que escuchamos en vez de asumir.
    const unsubscribe = auth.onChange((next) => {
      if (!cancelled) setSession(next);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await getAuth().signIn(email, password);
    setSession(next);
  }, []);

  const signOut = useCallback(async () => {
    await getAuth().signOut();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      ready,
      isOwner: session !== null,
      backend: getBackendMode(),
      authKind: getAuth().kind,
      signIn,
      signOut,
    }),
    [session, ready, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
