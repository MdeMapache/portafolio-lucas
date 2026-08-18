import { projects, type Project } from "@/data/portfolio";
import SectionLabel from "./SectionLabel";

function ActivityCard({ project }: { project: Project }) {
  const pct = Math.round((project.done / project.total) * 100);
  const complete = pct === 100;

  return (
    <div className="flex gap-3.5 py-3.5 border-b border-white/5 last:border-b-0">
      <div className="w-[88px] h-[52px] flex-shrink-0 flex items-center justify-center bg-steam-panel2 border border-steam-line text-xl">
        {project.icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className="text-steam-bright text-[15px] font-semibold">{project.title}</span>
          <span className="text-[11px] font-mono text-steam-dim">último commit: {project.lastCommit}</span>
        </div>
        <div className="text-[12.5px] text-steam-dim mb-2">{project.description}</div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-steam-dim whitespace-nowrap">
            Avance del proyecto&nbsp;&nbsp;{project.done}/{project.total} tareas
          </span>
          <div className="flex-1 h-[5px] rounded-full bg-steam-panel2 overflow-hidden">
            <div
              className={`h-full ${complete ? "bg-steam-green" : "bg-gradient-to-r from-[#4c8fb0] to-steam-link"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-steam-dim">{complete ? "Completo" : `${pct}%`}</span>
        </div>
      </div>
    </div>
  );
}

export default function ActivityFeed() {
  return (
    <>
      <SectionLabel title="Actividad reciente" count="18 commits esta semana" />
      <div className="bg-steam-panel border border-white/5">
        {projects.map((p) => (
          <ActivityCard key={p.title} project={p} />
        ))}
      </div>
    </>
  );
}
