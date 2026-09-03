"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import Portal from "@/components/ui/Portal";
import BackgroundTab from "./BackgroundTab";
import LinksTab from "./LinksTab";
import ProfileTab from "./ProfileTab";
import ProjectsTab from "./ProjectsTab";
import SkillsTab from "./SkillsTab";
import TrayectoriaTab from "./TrayectoriaTab";

const TABS = [
  { id: "perfil", code: "01", label: "Perfil", Component: ProfileTab },
  { id: "fondo", code: "02", label: "Fondo", Component: BackgroundTab },
  { id: "trayectoria", code: "03", label: "Trayectoria", Component: TrayectoriaTab },
  { id: "stack", code: "04", label: "Stack", Component: SkillsTab },
  { id: "proyectos", code: "05", label: "Proyectos", Component: ProjectsTab },
  { id: "enlaces", code: "06", label: "Enlaces", Component: LinksTab },
] as const;

type TabId = (typeof TABS)[number]["id"];

/**
 * Panel de configuración de la unidad.
 *
 * Va dentro de un Portal, y no es opcional: el botón que lo abre vive en el
 * `<aside>`, que lleva `backdrop-blur`. `backdrop-filter` crea un bloque
 * contenedor, así que un `position: fixed` adentro se ancla al sidebar —304 px
 * de ancho— en vez de al viewport, y el diálogo quedaba espachurrado contra la
 * esquina con scrollbars anidados.
 *
 * No tiene botón de guardar a propósito: cada campo persiste apenas cambia y
 * el indicador de la cabecera avisa cuándo se está escribiendo. Evita perder
 * cambios por cerrar sin confirmar.
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

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  const ActiveTab = active.Component;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-mw-void/88 backdrop-blur-sm p-0 sm:p-6 overflow-y-auto"
        onClick={onClose}
      >
        {/* Scanlines sobre el velo: el fondo también es una pantalla. */}
        <div aria-hidden className="crt-scanlines fixed inset-0 pointer-events-none" />

        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Configuración de la unidad"
          onClick={(e) => e.stopPropagation()}
          className="hud-panel-in relative w-full max-w-4xl my-0 sm:my-6 outline-none"
        >
          {/* Chapa: capa de borde y capa de relleno, como el panel de sección. */}
          <div aria-hidden className="hud-clip absolute inset-0 bg-mw-steel/55" />
          <div aria-hidden className="hud-clip absolute inset-[1.5px] bg-mw-void/97" />

          {/* Remaches en las cuatro esquinas. */}
          {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`hud-rivet absolute ${pos} w-1.5 h-1.5 bg-mw-steel/70 text-mw-steel/40 z-10`}
            />
          ))}

          <div className="relative">
            {/* Cabecera --------------------------------------------------- */}
            <header className="flex items-stretch">
              <span className="hud-tab flex items-center bg-mw-hazard/90 pl-5 pr-6 py-1.5 shrink-0">
                <span className="font-mono text-[10px] font-bold text-mw-void tracking-[0.25em]">
                  CFG
                </span>
              </span>

              <div className="flex items-center gap-3 flex-1 min-w-0 pl-3 pr-4 py-1.5 border-b border-mw-steel/30">
                <h2
                  data-text="Configuración de unidad"
                  className="glitch font-display text-[15px] sm:text-lg uppercase tracking-[0.18em] text-steam-bright truncate"
                >
                  Configuración de unidad
                </h2>

                <span aria-hidden className="hidden sm:flex items-center gap-[3px] shrink-0">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="hud-segment w-[3px] h-3 bg-mw-phosphor"
                      style={{ animationDelay: `${i * 170}ms` }}
                    />
                  ))}
                </span>

                {/* Indicador de escritura. Reserva su espacio siempre para que
                    la cabecera no se mueva cada vez que se guarda. */}
                <span
                  className={`ml-auto shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] transition-opacity ${
                    saving ? "text-mw-phosphor opacity-100" : "opacity-0"
                  }`}
                  aria-live="polite"
                >
                  ● grabando
                </span>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="shrink-0 w-6 h-6 flex items-center justify-center border border-mw-steel/30 text-steam-dim hover:text-mw-rust hover:border-mw-rust/60 transition-colors"
                >
                  ×
                </button>
              </div>
            </header>

            {/* Pestañas como placas numeradas ----------------------------- */}
            <nav className="flex flex-wrap gap-1.5 px-4 sm:px-5 py-3 border-b border-mw-steel/20">
              {TABS.map((t) => {
                const on = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    aria-current={on}
                    className={`hud-clip-sm shadow-plate group flex items-baseline gap-2 px-2.5 py-1.5 border transition-all ${
                      on
                        ? "border-mw-hazard/60 bg-mw-hazard/12"
                        : "border-mw-steel/25 bg-steam-panel2/40 hover:border-mw-steel/60"
                    }`}
                  >
                    <span
                      className={`font-mono text-[8.5px] px-1 leading-[1.5] ${
                        on ? "bg-mw-hazard text-mw-void font-bold" : "text-steam-dim/60"
                      }`}
                    >
                      {t.code}
                    </span>
                    <span
                      className={`font-display text-[11px] uppercase tracking-[0.16em] ${
                        on ? "text-steam-bright" : "text-steam-dim group-hover:text-steam-text"
                      }`}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {error ? (
              <p
                role="alert"
                className="hud-clip-sm mx-4 sm:mx-5 mt-3 px-3 py-2 font-mono text-[11px] text-mw-rust bg-mw-rust/10 border border-mw-rust/50"
              >
                {error}
              </p>
            ) : null}

            {/* Contenido -------------------------------------------------- */}
            <div className="px-4 sm:px-5 py-5 max-h-[65vh] overflow-y-auto">
              {/* `key` reinicia la animación de entrada al cambiar de pestaña. */}
              <div key={tab} className="hud-content-in">
                <ActiveTab />
              </div>
            </div>

            {/* Pie -------------------------------------------------------- */}
            <footer className="border-t border-mw-steel/20">
              <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 flex-wrap">
                {confirmingReset ? (
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-[10px] text-mw-rust uppercase tracking-wider">
                      ⚠ borra todo: cambios e imágenes subidas
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        await reset();
                        setConfirmingReset(false);
                      }}
                      className="hud-clip-sm shadow-plate px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] border border-mw-rust bg-mw-rust/20 text-mw-rust hover:bg-mw-rust/35 transition-all"
                    >
                      confirmar purga
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingReset(false)}
                      className="font-mono text-[10px] uppercase tracking-wider text-steam-dim hover:text-steam-bright transition-colors"
                    >
                      cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(true)}
                    className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-steam-dim/70 hover:text-mw-rust transition-colors"
                  >
                    restablecer todo
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="hud-clip-sm shadow-plate px-5 py-2 font-display text-[12px] uppercase tracking-[0.2em] border border-mw-hazard/60 bg-mw-hazard/12 text-mw-hazard hover:bg-mw-hazard/25 hover:shadow-glow-hazard transition-all"
                >
                  Listo
                </button>
              </div>

              {/* Tira de estado, gemela de la del panel de sección. */}
              <div className="flex items-center gap-2 px-4 sm:px-5 pb-2.5">
                <span aria-hidden className="hazard-stripe-dim h-[6px] flex-1 opacity-55" />
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-steam-dim/60 shrink-0">
                  módulo {active.code} · {active.label} · cambios en vivo
                </span>
                <span aria-hidden className="hazard-stripe-dim h-[6px] w-10 opacity-55" />
              </div>
            </footer>
          </div>
        </div>
      </div>
    </Portal>
  );
}
