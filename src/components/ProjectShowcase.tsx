"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { usePortfolio } from "@/components/PortfolioProvider";
import AssetImage from "@/components/ui/AssetImage";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import type { Project } from "@/lib/portfolio/types";

/** Enlace de acción de una tarjeta (demo o repositorio). */
function ActionLink({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-3 py-1.5 text-[11.5px] font-display uppercase tracking-wide border transition-all hover:-translate-y-px ${
        primary
          ? "border-steam-link text-white bg-gradient-to-b from-[#2a5a7a] to-[#1c3c52] hover:from-[#347399] hover:to-[#25516f]"
          : "border-steam-line text-steam-dim hover:text-steam-bright hover:border-steam-link"
      }`}
    >
      {children}
    </a>
  );
}

function TechChips({ tech }: { tech: string[] }) {
  if (tech.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tech.map((t) => (
        <span
          key={t}
          className="text-[10px] px-2 py-0.5 font-mono text-steam-dim border border-steam-line/70"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function Screenshots({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null;
  return (
    <div className="flex gap-2 flex-wrap mt-3">
      {ids.map((id) => (
        <div
          key={id}
          className="w-32 h-20 border border-steam-line overflow-hidden bg-steam-bgDeep transition-transform hover:scale-105"
        >
          <AssetImage assetId={id} alt="Captura del proyecto" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

/** Tarjeta grande del proyecto destacado. */
function FeaturedCard({ project, isOwner }: { project: Project; isOwner: boolean }) {
  const pct = project.total > 0 ? Math.round((project.done / project.total) * 100) : 0;

  return (
    <article className="border border-steam-link/40 bg-gradient-to-br from-steam-panel2/80 to-steam-panel p-5 mb-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-steam-panel2 border border-steam-line text-3xl">
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-steam-bright text-lg font-semibold">{project.title}</h3>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 border border-steam-gold text-steam-gold">
              destacado
            </span>
          </div>
          <p className="text-[13px] text-steam-dim mb-2">{project.description}</p>
          <TechChips tech={project.tech} />
        </div>
      </div>

      {project.longDescription ? (
        <p className="text-[12.5px] leading-relaxed text-steam-text/85 mt-3.5">
          {project.longDescription}
        </p>
      ) : null}

      <Screenshots ids={project.screenshotAssetIds} />

      <div className="flex items-center gap-2.5 mt-4 flex-wrap">
        {project.demoUrl ? (
          <ActionLink href={project.demoUrl} primary>
            Demo en vivo
          </ActionLink>
        ) : null}
        {project.repoUrl ? <ActionLink href={project.repoUrl}>Código</ActionLink> : null}
        {/* El recordatorio es para vos; al visitante sólo le muestra un hueco. */}
        {!project.demoUrl && !project.repoUrl && isOwner ? (
          <span className="text-[11px] font-mono text-steam-dim/70">
            Sin enlaces todavía — agregalos desde Modificar perfil → Proyectos.
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2.5 mt-4">
        <span className="text-[11px] font-mono text-steam-dim whitespace-nowrap">
          {project.done}/{project.total} tareas
        </span>
        <div className="flex-1">
          <ProgressBar
            value={pct}
            className={pct === 100 ? "bg-steam-green" : "bg-gradient-to-r from-[#4c8fb0] to-steam-link"}
          />
        </div>
        <span className="text-[11px] font-mono text-steam-dim w-16 text-right">
          {pct === 100 ? "Completo" : `${pct}%`}
        </span>
      </div>
    </article>
  );
}

/** Tarjeta compacta, plegable, para el resto de los proyectos. */
function CompactCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const hasDetail = Boolean(project.longDescription || project.screenshotAssetIds.length);

  return (
    <article className="border border-steam-line/60 bg-steam-panel2/40 p-3.5 transition-colors hover:border-steam-link/50">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-steam-panel2 border border-steam-line text-xl">
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-steam-bright text-[14px] font-semibold mb-0.5">{project.title}</h3>
          <p className="text-[12px] text-steam-dim mb-2">{project.description}</p>
          <TechChips tech={project.tech} />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {project.demoUrl ? (
          <ActionLink href={project.demoUrl} primary>
            Demo
          </ActionLink>
        ) : null}
        {project.repoUrl ? <ActionLink href={project.repoUrl}>Código</ActionLink> : null}
        {hasDetail ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="px-2 py-1.5 text-[11.5px] text-steam-dim hover:text-steam-link transition-colors"
          >
            {open ? "Menos" : "Más detalle"}
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="mt-3 pt-3 border-t border-steam-line/50">
          {project.longDescription ? (
            <p className="text-[12.5px] leading-relaxed text-steam-text/85">
              {project.longDescription}
            </p>
          ) : null}
          <Screenshots ids={project.screenshotAssetIds} />
        </div>
      ) : null}
    </article>
  );
}

/**
 * Vitrina de demos: el equivalente al "Expositor de artículos" de Steam, pero
 * mostrando proyectos con su demo en vivo y su repositorio.
 */
export default function ProjectShowcase() {
  const { data } = usePortfolio();
  const { isOwner } = useAuth();
  const { projects } = data;

  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => p !== featured);

  return (
    <Panel
      id="proyectos"
      title="Vitrina de proyectos"
      aside={<span className="font-mono text-steam-dim">{projects.length} publicados</span>}
    >
      {projects.length === 0 ? (
        <p className="text-xs text-steam-dim">
          {isOwner
            ? "Todavía no hay proyectos. Agregalos desde Modificar perfil → Proyectos."
            : "Todavía no hay proyectos publicados."}
        </p>
      ) : (
        <>
          {featured ? <FeaturedCard project={featured} isOwner={isOwner} /> : null}
          {rest.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rest.map((p) => (
                <CompactCard key={p.id} project={p} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </Panel>
  );
}
