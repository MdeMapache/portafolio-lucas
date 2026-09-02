"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import type { Project } from "@/lib/portfolio/types";

function ActivityRow({ project }: { project: Project }) {
  const pct = project.total > 0 ? Math.round((project.done / project.total) * 100) : 0;
  const complete = pct === 100;

  return (
    <div className="flex gap-3.5 py-3.5 border-b border-white/5 last:border-b-0">
      <div className="w-[88px] h-[52px] shrink-0 flex items-center justify-center bg-steam-panel2 border border-steam-line text-xl transition-colors hover:border-steam-link">
        {project.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-3 mb-0.5">
          <span className="text-steam-bright text-[15px] font-semibold truncate">
            {project.title}
          </span>
          <span className="text-[11px] font-mono text-steam-dim whitespace-nowrap">
            último commit: {project.lastCommit}
          </span>
        </div>
        <div className="text-[12.5px] text-steam-dim mb-2">{project.description}</div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-steam-dim whitespace-nowrap">
            {project.done}/{project.total} tareas
          </span>
          <div className="flex-1">
            <ProgressBar
              value={pct}
              className={
                complete ? "bg-steam-green" : "bg-gradient-to-r from-[#4c8fb0] to-steam-link"
              }
            />
          </div>
          <span className="text-[11px] font-mono text-steam-dim w-16 text-right">
            {complete ? "Completo" : `${pct}%`}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Actividad reciente: avance de cada proyecto, como las horas jugadas de Steam. */
export default function ActivityFeed() {
  const { data } = usePortfolio();
  const { projects } = data;

  const totalTasks = projects.reduce((sum, p) => sum + p.done, 0);

  if (projects.length === 0) return null;

  return (
    <Panel
      title="Actividad reciente"
      bodyClassName="px-5 py-1"
      aside={
        <span className="font-mono text-steam-dim">{totalTasks} tareas completadas</span>
      }
    >
      {projects.map((project) => (
        <ActivityRow key={project.id} project={project} />
      ))}
    </Panel>
  );
}
