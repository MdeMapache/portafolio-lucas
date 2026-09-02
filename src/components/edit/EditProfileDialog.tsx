"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import BackgroundTab from "./BackgroundTab";
import LinksTab from "./LinksTab";
import ProfileTab from "./ProfileTab";
import ProjectsTab from "./ProjectsTab";
import SkillsTab from "./SkillsTab";
import TrayectoriaTab from "./TrayectoriaTab";

const TABS = [
  { id: "perfil", label: "Perfil", Component: ProfileTab },
  { id: "fondo", label: "Fondo", Component: BackgroundTab },
  { id: "trayectoria", label: "Trayectoria", Component: TrayectoriaTab },
  { id: "stack", label: "Stack", Component: SkillsTab },
  { id: "proyectos", label: "Proyectos", Component: ProjectsTab },
  { id: "enlaces", label: "Enlaces", Component: LinksTab },
] as const;

type TabId = (typeof TABS)[number]["id"];

/**
 * Panel de administración del perfil, al estilo del "Editar perfil" de Steam.
 *
 * No tiene botón de guardar a propósito: cada campo persiste apenas cambia, y
 * el indicador de la cabecera avisa cuándo se está escribiendo. Es el mismo
 * comportamiento que tiene la configuración de Steam y evita que se pierdan
 * cambios por cerrar el panel sin confirmar.
 */
export default function EditProfileDialog({ onClose }: { onClose: () => void }) {
  const { saving, error, reset } = usePortfolio();
  const [tab, setTab] = useState<TabId>("perfil");
  const [confirmingReset, setConfirmingReset] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  // Al abrir, el foco entra al panel para que el teclado no quede en la página.
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const ActiveTab = TABS.find((t) => t.id === tab)?.Component ?? ProfileTab;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/75 p-0 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Modificar perfil"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-steam-panel border border-steam-line shadow-2xl outline-none my-0 sm:my-6"
      >
        {/* Cabecera ------------------------------------------------------- */}
        <header className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-steam-line to-steam-bgTop">
          <h2 className="text-steam-bright text-sm tracking-wide">Modificar perfil</h2>
          <div className="flex items-center gap-3">
            <span
              className={`text-[11px] font-mono transition-opacity ${
                saving ? "text-steam-green opacity-100" : "text-steam-dim opacity-0"
              }`}
              aria-live="polite"
            >
              guardando…
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-steam-dim hover:text-white text-lg leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </header>

        {/* Pestañas ------------------------------------------------------- */}
        <div className="flex gap-1 px-4 pt-3 border-b border-steam-line/60 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id}
              className={`px-3.5 py-2 text-[12.5px] font-display uppercase tracking-wide whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? "border-steam-link text-steam-bright"
                  : "border-transparent text-steam-dim hover:text-steam-bright"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error ? (
          <p className="mx-4 mt-3 px-3 py-2 text-[12px] font-mono text-red-300 bg-red-950/40 border border-red-900/60">
            {error}
          </p>
        ) : null}

        {/* Contenido ------------------------------------------------------ */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <ActiveTab />
        </div>

        {/* Pie ------------------------------------------------------------ */}
        <footer className="flex items-center justify-between gap-3 px-4 py-3 border-t border-steam-line/60">
          {confirmingReset ? (
            <div className="flex items-center gap-2.5">
              <span className="text-[12px] text-steam-text">
                Esto borra todos tus cambios y las imágenes subidas. ¿Seguro?
              </span>
              <button
                type="button"
                onClick={async () => {
                  await reset();
                  setConfirmingReset(false);
                }}
                className="px-3 py-1 text-[11.5px] font-display uppercase border border-red-700 text-red-300 hover:bg-red-950/50 transition-colors"
              >
                Sí, restablecer
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="text-[11.5px] text-steam-dim hover:text-steam-bright transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="text-[11.5px] text-steam-dim hover:text-red-400 transition-colors"
            >
              Restablecer todo
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-[12.5px] font-display uppercase tracking-wide border border-steam-link text-white bg-gradient-to-b from-[#2a5a7a] to-[#1c3c52] hover:from-[#347399] hover:to-[#25516f] transition-colors"
          >
            Listo
          </button>
        </footer>
      </div>
    </div>
  );
}
