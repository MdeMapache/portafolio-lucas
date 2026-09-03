"use client";

import { useEffect, useRef, useState } from "react";
import Portal from "@/components/ui/Portal";
import { duckAudio } from "@/lib/audioBus";
import type { Project } from "@/lib/portfolio/types";

/** Si en este tiempo no cargó, casi seguro el sitio bloquea el embebido. */
const LOAD_TIMEOUT_MS = 8000;

/**
 * Cabina de simulación: el visor a pantalla completa de un demo.
 *
 * Antes el juego corría dentro de la tarjeta, en un recuadro de 300 px de alto.
 * Un export de Godot no se juega cómodo ahí: necesita superficie. Al darle a
 * jugar se abre esta cabina, que le da al juego casi toda la pantalla y usa el
 * espacio restante para la ficha de controles.
 *
 * Mientras está abierta, la música del sitio se silencia: el juego trae la
 * suya y competir con la banda sonora es insoportable.
 */
export default function DemoCockpit({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [showCheats, setShowCheats] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Escape cierra, y el fondo no scrollea mientras la cabina está abierta.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  // Silencia la música del sitio mientras dura la simulación.
  useEffect(() => {
    duckAudio(true);
    return () => duckAudio(false);
  }, []);

  useEffect(() => {
    if (loaded) return;
    const timer = window.setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [loaded]);

  if (!project.demoUrl) return null;

  const estado = loaded ? "en marcha" : timedOut ? "sin respuesta" : "arrancando";

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-mw-void/92 backdrop-blur-sm p-0 sm:p-4">
        <div aria-hidden className="crt-scanlines fixed inset-0 pointer-events-none" />

        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Simulación: ${project.title}`}
          className="hud-panel-in relative w-full h-full sm:h-[94vh] max-w-[1500px]"
        >
          {/* Chapa: capa de borde y capa de relleno. */}
          <div aria-hidden className="hud-clip absolute inset-0 bg-mw-hazard/45" />
          <div aria-hidden className="hud-clip absolute inset-[1.5px] bg-mw-void/98" />

          {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`hud-rivet absolute ${pos} w-1.5 h-1.5 bg-mw-hazard/70 text-mw-hazard/40 z-10`}
            />
          ))}

          <div className="relative h-full flex flex-col">
            {/* Cabecera ------------------------------------------------- */}
            <header className="flex items-stretch shrink-0">
              <span className="hud-tab flex items-center bg-mw-hazard/90 pl-5 pr-6 py-1.5 shrink-0">
                <span className="font-mono text-[10px] font-bold text-mw-void tracking-[0.25em]">
                  SIM
                </span>
              </span>

              <div className="flex items-center gap-3 flex-1 min-w-0 pl-3 pr-4 py-1.5 border-b border-mw-hazard/25">
                <span className="text-base shrink-0">{project.icon}</span>
                <h2
                  data-text={project.title}
                  className="glitch font-display text-[14px] sm:text-base uppercase tracking-[0.16em] text-steam-bright truncate"
                >
                  {project.title}
                </h2>

                <span aria-hidden className="hidden sm:flex items-center gap-[3px] shrink-0">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="hud-segment w-[3px] h-3 bg-mw-phosphor"
                      style={{ animationDelay: `${i * 160}ms` }}
                    />
                  ))}
                </span>

                <span
                  className={`ml-auto shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] ${
                    loaded ? "text-mw-phosphor" : timedOut ? "text-mw-rust" : "text-steam-dim"
                  }`}
                  aria-live="polite"
                >
                  ● {estado}
                </span>

                <button
                  type="button"
                  onClick={() => frameRef.current?.requestFullscreen?.()}
                  title="Pantalla completa"
                  className="shrink-0 w-6 h-6 flex items-center justify-center border border-mw-steel/30 text-steam-dim hover:text-mw-hazard hover:border-mw-hazard/60 transition-colors"
                >
                  ⛶
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Salir de la simulación"
                  className="shrink-0 w-6 h-6 flex items-center justify-center border border-mw-steel/30 text-steam-dim hover:text-mw-rust hover:border-mw-rust/60 transition-colors"
                >
                  ×
                </button>
              </div>
            </header>

            {/* Cuerpo: juego + ficha lateral ---------------------------- */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-2 p-2 sm:p-3">
              {/* Pantalla del juego. */}
              <div className="relative flex-1 min-h-0 bg-black border border-mw-hazard/25">
                {!loaded ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
                    <span className="font-mono text-[12px] text-mw-hazard animate-pulse tracking-[0.2em]">
                      INICIANDO SIMULACIÓN…
                    </span>
                    <span className="font-mono text-[9.5px] text-steam-dim">
                      el paquete pesa varios MB
                    </span>
                    {timedOut ? (
                      <span className="font-mono text-[9.5px] text-mw-rust max-w-[70%] text-center leading-relaxed">
                        Tarda de más. Puede que el sitio bloquee el embebido — probá abrirlo en una
                        pestaña propia.
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <iframe
                  ref={frameRef}
                  src={project.demoUrl}
                  title={`Demo de ${project.title}`}
                  onLoad={() => setLoaded(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
                  allow="fullscreen; gamepad; autoplay; cross-origin-isolated"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  className="w-full h-full border-0"
                />
              </div>

              {/* Ficha lateral: controles y trucos. Sólo aparece si hay algo
                  que mostrar, para no dejar una columna vacía al costado. */}
              {project.controls.length > 0 || project.cheats.length > 0 ? (
                <aside className="lg:w-[280px] shrink-0 overflow-y-auto bg-mw-fieldDeep/70 border border-mw-steel/25 shadow-plate p-3">
                  {project.controls.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span aria-hidden className="font-mono text-[8.5px] text-mw-steel/70">
                          {"//"}
                        </span>
                        <h3 className="font-mono text-[9px] uppercase tracking-[0.24em] text-mw-hazard">
                          controles
                        </h3>
                        <span
                          aria-hidden
                          className="flex-1 h-px bg-gradient-to-r from-mw-steel/40 to-transparent"
                        />
                      </div>

                      <dl className="mb-5">
                        {project.controls.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-baseline gap-2.5 py-1.5 border-b border-mw-steel/15 last:border-b-0"
                          >
                            <dt className="hud-clip-sm shrink-0 min-w-[52px] text-center px-1.5 py-0.5 bg-steam-panel2 border border-mw-steel/35 font-mono text-[9.5px] text-mw-steelLight">
                              {c.key}
                            </dt>
                            <dd className="font-mono text-[10.5px] text-steam-text leading-snug">
                              {c.action}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </>
                  ) : null}

                  {project.cheats.length > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowCheats((v) => !v)}
                        aria-expanded={showCheats}
                        className="flex items-center gap-2 w-full mb-2.5 group"
                      >
                        <span aria-hidden className="font-mono text-[8.5px] text-mw-steel/70">
                          {"//"}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-mw-rust">
                          trucos
                        </span>
                        <span className="ml-auto font-mono text-[9px] text-steam-dim group-hover:text-mw-rust transition-colors">
                          {showCheats ? "[ − ]" : `[ + ] ${project.cheats.length}`}
                        </span>
                      </button>

                      {/* Plegados por defecto: quien no quiere spoilers no los ve. */}
                      {showCheats ? (
                        <dl>
                          {project.cheats.map((c) => (
                            <div
                              key={c.id}
                              className="flex items-baseline gap-2.5 py-1.5 border-b border-mw-steel/15 last:border-b-0"
                            >
                              <dt className="hud-clip-sm shrink-0 px-1.5 py-0.5 bg-mw-rust/12 border border-mw-rust/40 font-mono text-[9.5px] text-mw-rust">
                                {c.code}
                              </dt>
                              <dd className="font-mono text-[10.5px] text-steam-dim leading-snug">
                                {c.effect}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                    </>
                  ) : null}
                </aside>
              ) : null}
            </div>

            {/* Tira de estado ------------------------------------------- */}
            <footer className="flex items-center gap-2 px-3 pb-2 shrink-0">
              <span aria-hidden className="hazard-stripe-dim h-[6px] flex-1 opacity-55" />
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-steam-dim/70 shrink-0">
                simulación activa · audio del sitio en silencio · esc para salir
              </span>
              <span aria-hidden className="hazard-stripe-dim h-[6px] w-10 opacity-55" />
            </footer>
          </div>
        </div>
      </div>
    </Portal>
  );
}
