"use client";

import { useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import BlockDivider from "@/components/ui/BlockDivider";
import SpecGrid from "@/components/ui/SpecGrid";
import UnitCard from "@/components/ui/UnitCard";
import { ACCENT_HAZARD, ACCENT_PHOSPHOR, ACCENT_STEEL } from "@/components/ui/accents";
import type { Project } from "@/lib/portfolio/types";
import DemoCockpit from "./DemoCockpit";

/**
 * Demos en vivo.
 *
 * Los demos no son un modelo aparte: cualquier proyecto con `demoUrl` aparece
 * acá. Así se editan desde el mismo lugar que todo lo demás (Modificar perfil →
 * Proyectos) y no hay dos listas que mantener.
 *
 * La tarjeta ya no embebe el juego: es la ficha de la unidad, y el juego se
 * abre en una cabina a pantalla completa. Un export de Godot no se juega cómodo
 * en un recuadro de 300 px, y cargarlo al abrir la pestaña sería descargar
 * decenas de MB a alguien que quizá sólo vino a mirar.
 */
function DemoEntry({ project }: { project: Project }) {
  const [running, setRunning] = useState(false);

  if (!project.demoUrl) return null;

  const selfHosted = project.demoUrl.startsWith("/");
  const accent = selfHosted ? ACCENT_PHOSPHOR : ACCENT_STEEL;

  return (
    <>
      <UnitCard
        code={selfHosted ? "LOC" : "EXT"}
        title={project.title}
        accent={running ? ACCENT_HAZARD : accent}
        canvas="radar"
        aside={running ? "en simulación" : "en espera"}
      >
        <div className="flex items-start gap-3">
          <div className="hud-clip-sm shadow-plate w-11 h-11 shrink-0 flex items-center justify-center border border-current/30 bg-mw-fieldDeep text-xl">
            {project.icon}
          </div>
          <p className="flex-1 min-w-0 font-mono text-[10px] text-steam-text/80 leading-relaxed">
            {project.description}
          </p>
        </div>

        <SpecGrid
          className="mt-3"
          items={[
            { label: "origen", value: selfHosted ? "LOCAL" : "EXTERNO" },
            {
              label: "controles",
              value: project.controls.length
                ? String(project.controls.length).padStart(2, "0")
                : "—",
            },
            {
              label: "trucos",
              value: project.cheats.length ? String(project.cheats.length).padStart(2, "0") : "—",
            },
          ]}
        />

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <button
            type="button"
            onClick={() => setRunning(true)}
            className="hud-clip-sm shadow-plate flex items-center gap-2 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] border border-mw-hazard/60 bg-mw-hazard/12 text-mw-hazard hover:bg-mw-hazard/25 hover:shadow-glow-hazard transition-all hover:-translate-y-px"
          >
            <span aria-hidden>▶</span> iniciar simulación
          </button>

          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hud-clip-sm shadow-plate px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] border border-mw-steel/40 bg-steam-panel2/50 text-steam-dim hover:border-mw-steel hover:text-mw-steelLight transition-all"
          >
            pestaña propia ↗
          </a>
        </div>

        {/* Es honesto avisarlo: un export de Godot ronda los 50 MB. */}
        <p className="font-mono text-[9px] text-steam-dim/50 mt-2">
          el paquete se descarga al iniciar
        </p>
      </UnitCard>

      {running ? <DemoCockpit project={project} onClose={() => setRunning(false)} /> : null}
    </>
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
        <div className="mw-frame text-mw-steel/50 border border-dashed border-mw-steel/30 p-8 text-center">
          <p className="font-mono text-[11px] text-steam-dim">Sin demos publicados todavía.</p>
          <p className="font-mono text-[10px] text-steam-dim/60 mt-2 leading-relaxed">
            Cargá la URL en Modificar perfil → Proyectos → Demo en vivo.
            <br />
            Para un build propio en <code className="text-mw-hazard">public/demos/</code>, usá una
            ruta como <code className="text-mw-hazard">/demos/mi-juego/index.html</code>.
          </p>
        </div>
      ) : (
        // `gap-6`: los rótulos van montados fuera del borde de cada tarjeta.
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {withDemo.map((project) => (
            <DemoEntry key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
