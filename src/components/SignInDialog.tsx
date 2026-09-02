"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Portal from "@/components/ui/Portal";

/** Login del dueño del portafolio. Los visitantes nunca necesitan abrirlo. */
export default function SignInDialog({ onClose }: { onClose: () => void }) {
  const { signIn, authKind } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    firstFieldRef.current?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await signIn(email, password);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "w-full bg-steam-bgDeep border border-steam-line px-3 py-2 text-[13px] text-steam-text " +
    "outline-none transition-colors focus:border-steam-link placeholder:text-steam-dim/50";

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        onClick={onClose}
      >
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Iniciar sesión"
          className="w-full max-w-sm bg-steam-panel border border-steam-line shadow-2xl"
        >
          <header className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-steam-line to-steam-bgTop">
            <h2 className="text-steam-bright text-sm tracking-wide">Iniciar sesión</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-steam-dim hover:text-white text-lg leading-none transition-colors"
            >
              ×
            </button>
          </header>

          <div className="p-4">
            {authKind === "local" ? (
              <p className="mb-4 px-3 py-2 text-[11.5px] leading-relaxed text-steam-gold bg-steam-gold/10 border border-steam-gold/40">
                Modo local: esta clave no es seguridad real, sólo hace andar el mismo flujo sin
                backend. Los datos viven en este navegador y nadie más los ve.
              </p>
            ) : null}

            <label className="block mb-3">
              <span className="block text-[11px] uppercase tracking-wide text-steam-dim mb-1.5">
                Email
              </span>
              <input
                ref={firstFieldRef}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required={authKind === "supabase"}
              />
            </label>

            <label className="block mb-4">
              <span className="block text-[11px] uppercase tracking-wide text-steam-dim mb-1.5">
                {authKind === "local" ? "Frase" : "Contraseña"}
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </label>

            {error ? (
              <p
                role="alert"
                className="mb-3 px-3 py-2 text-[12px] font-mono text-red-300 bg-red-950/40 border border-red-900/60"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="w-full px-5 py-2 text-[12.5px] font-display uppercase tracking-wide border border-steam-link text-white bg-gradient-to-b from-[#2a5a7a] to-[#1c3c52] hover:from-[#347399] hover:to-[#25516f] transition-colors disabled:opacity-50"
            >
              {busy ? "Entrando…" : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
}
