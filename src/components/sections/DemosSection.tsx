"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import BlockDivider from "@/components/ui/BlockDivider";
import UnitCard from "@/components/ui/UnitCard";
import { ACCENT_HAZARD, ACCENT_PHOSPHOR, ACCENT_STEEL } from "@/components/ui/accents";
import { duckAudio } from "@/lib/audioBus";
import type { Project } from "@/lib/portfolio/types";

/** Si en este tiempo no cargó, casi seguro el sitio bloquea el embebido. */
const LOAD_TIMEOUT_MS = 6000;

/**
 * Demos en vivo.
 *
 * Los demos no son un modelo aparte: cualquier proyecto con `demoUrl` aparece
 * acá embebido. Así se editan desde el mismo lugar que todo lo demás
 * (Modificar perfil → Proyectos) y no hay dos listas que mantener.
 *
 * Sirve tanto para una URL externa como para un build autohospedado en
 * `public/demos/` — ver el README de esa carpeta.
 */
function DemoFrame({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Si no cargó a tiempo, avisamos en vez de dejar un recuadro negro mudo.
  useEffect(() => {
    if (!running || loaded) return;
    const timer = window.setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [running, loaded]);

  // Mientras corre un demo, la música del sitio se calla: un juego con su
  // propio audio compitiendo con la banda sonora es insoportable.
  useEffect(() => {
    duckAudio(running);
    return () => duckAudio(false);
  }, [running]);

  if (!project.demoUrl) return null;

  const selfHosted = project.demoUrl.startsWith("/");

  // El color comunica estado: amarillo mientras corre, y en reposo distingue
  // un build propio (fósforo) de uno alojado afuera (acero).
  const accent = running ? ACCENT_HAZARD : selfHosted ? ACCENT_PHOSPHOR : ACCENT_STEEL;
  const status = running ? (loaded ? "en marcha" : "cargando…") : "en espera";

  return (
    <UnitCard
      code={selfHosted ? "LOC" : "EXT"}
      title={project.title}
      accent={accent}
      canvas="radar"
      aside={status}
    >
      {/* Barra de control. Va dentro del cuerpo y no en la cabecera porque el
          borde superior ya lo ocupan el título y el código de la unidad. */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="text-base shrink-0">{project.icon}</span>
        <p className="font-mono text-[10px] text-steam-dim/70 leading-snug flex-1 min-w-0">
          {project.description}
        </p>

        <div className="flex items-center gap-2.5 shrink-0">
          {running ? (
            <>
              <button
                type="button"
                onClick={() => frameRef.current?.requestFullscreen?.()}
                title="Pantalla completa"
                className="font-mono text-[11px] text-steam-dim hover:text-current transition-colors"
              >
                ⛶
              </button>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                title={expanded ? "Reducir" : "Agrandar"}
                className="font-mono text-[10px] text-steam-dim hover:text-current transition-colors"
              >
                {expanded ? "[ − ]" : "[ + ]"}
              </button>
            </>
          ) : null}
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-current hover:text-mw-rust transition-colors"
          >
            ABRIR ↗
          </a>
        </div>
      </div>

      <div
        className={`relative bg-black border border-current/25 transition-[height] ${
          expanded ? "h-[75vh]" : "h-[300px]"
        }`}
      >
        {!running ? (
          /*
            El demo no arranca solo: un export de Godot pesa decenas de MB y
            cargar todos los demos de la página a la vez sería brutal para quien
            entra sólo a mirar. Se carga cuando lo piden.
          */
          <button
            type="button"
            onClick={() => setRunning(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 group/play"
          >
            <span className="font-mono text-3xl text-current transition-transform group-hover/play:scale-110">
              ▶
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-steam-dim">
              iniciar demo
            </span>
            <span className="font-mono text-[9px] text-steam-dim/50">puede pesar varios MB</span>
          </button>
        ) : (
          <>
            {!loaded ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                <span className="font-mono text-[11px] text-current animate-pulse">CARGANDO…</span>
                {timedOut ? (
                  <span className="font-mono text-[9.5px] text-mw-rust max-w-[80%] text-center leading-relaxed">
                    Tarda de más. Puede que el sitio bloquee el embebido — probá con ABRIR ↗
                  </span>
                ) : null}
              </div>
            ) : null}

            {/*
              `sandbox` limita lo que el contenido embebido puede hacer.
              `allow` habilita lo que un juego necesita: pantalla completa,
              gamepad, y el aislamiento de origen para los builds con hilos.
            */}
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
          </>
        )}
      </div>
    </UnitCard>
  );
}

export default function DemosSection() {
  const { data } = usePortfolio();
  const withDemo = data.projects.filter((p) => p.demoUrl);

  return (
    <div>
      <BlockDivider
        label="unidades desplegables"
        count={`${String(withDemo.length).padStart(2, "0")} en línea`}
      />

      {withDemo.length === 0 ? (
        <div className="mw-frame text-mw-phosphor/50 border border-dashed border-mw-phosphor/25 p-8 text-center">
          <p className="font-mono text-[11px] text-steam-dim">Sin demos publicados todavía.</p>
          <p className="font-mono text-[10px] text-steam-dim/60 mt-2 leading-relaxed">
            Cargá la URL en Modificar perfil → Proyectos → Demo en vivo.
            <br />
            Para un build propio en <code className="text-mw-phosphor">public/demos/</code>, usá una
            ruta como <code className="text-mw-phosphor">/demos/mi-juego/index.html</code>.
          </p>
        </div>
      ) : (
        // `gap-6`: los rótulos van montados fuera del borde de cada tarjeta.
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {withDemo.map((project) => (
            <DemoFrame key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
