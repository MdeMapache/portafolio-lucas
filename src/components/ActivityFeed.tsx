"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { accentFor } from "@/components/ui/accents";
import type { Project } from "@/lib/portfolio/types";

function ActivityRow({ project, index }: { project: Project; index: number }) {
  const pct = project.total > 0 ? Math.round((project.done / project.total) * 100) : 0;
  const complete = pct === 100;
  const accent = accentFor(index);

  return (
    <div
      className={`group relative corner-frame border ${accent.border} ${accent.text} ${accent.glow} bg-cyber-void/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5`}
    >
      <span className="scan-sweep" />

      <div className="flex items-baseline gap-2.5 mb-1">
        <span className="font-mono text-[9.5px] shrink-0">
          [{String(index + 1).padStart(2, "0")}]
        </span>
        <h3
          data-text={project.title}
          className="glitch font-display text-[13.5px] uppercase tracking-wide text-steam-bright truncate"
        >
          {project.title}
        </h3>
        <span className="ml-auto shrink-0 font-mono text-[9.5px] text-steam-dim">
          {project.lastCommit}
        </span>
      </div>

      <p className="font-mono text-[10.5px] text-steam-dim leading-relaxed mb-2.5 ml-[30px]">
        {project.description}
      </p>

      <div className="flex items-center gap-2.5 ml-[30px]">
        <span className="font-mono text-[9.5px] text-steam-dim whitespace-nowrap">
          {String(project.done).padStart(2, "0")}/{String(project.total).padStart(2, "0")}
        </span>
        <div className="flex-1">
          <ProgressBar
            value={pct}
            className={
              complete
                ? "bg-cyber-lime text-cyber-lime bar-glow"
                : "bg-cyber-cyan text-cyber-cyan bar-glow"
            }
            trackClassName="rounded-none bg-cyber-void/70 border border-cyber-cyan/15"
          />
        </div>
        <span
          className={`font-mono text-[9.5px] w-14 text-right ${
            complete ? "text-cyber-lime" : "text-steam-dim"
          }`}
        >
          {complete ? "COMPLETO" : `${String(pct).padStart(3, "0")}%`}
        </span>
      </div>
    </div>
  );
}

/** Actividad reciente: avance por proyecto, como un log de sistema. */
export default function ActivityFeed() {
  const { data } = usePortfolio();
  const { projects } = data;

  const totalTasks = projects.reduce((sum, p) => sum + p.done, 0);

  if (projects.length === 0) return null;

  return (
    <Panel
      title="Log de actividad"
      aside={<span className="text-steam-dim">{totalTasks} tareas cerradas</span>}
      bodyClassName="grid grid-cols-1 gap-2"
    >
      {projects.map((project, i) => (
        <ActivityRow key={project.id} project={project} index={i} />
      ))}
    </Panel>
  );
}
