"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { usePortfolio } from "@/components/PortfolioProvider";
import AssetImage from "@/components/ui/AssetImage";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { accentFor } from "@/components/ui/accents";
import type { Project } from "@/lib/portfolio/types";

/** Enlace de acción con borde neón y flecha de salida. */
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
      className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-all hover:-translate-y-px ${
        primary
          ? "border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-neon-cyan"
          : "border-steam-dim/40 text-steam-dim hover:border-cyber-magenta hover:text-cyber-magenta hover:shadow-neon-magenta"
      }`}
    >
      {children} ↗
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
          className="font-mono text-[9px] px-1.5 py-0.5 text-steam-dim border border-steam-dim/25 tracking-wider uppercase"
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
          className="w-32 h-20 border border-cyber-cyan/25 overflow-hidden bg-black transition-all hover:border-cyber-cyan hover:shadow-neon-cyan"
        >
          <AssetImage
            assetId={id}
            alt="Captura del proyecto"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

/** Tarjeta grande del proyecto destacado. */
function FeaturedCard({ project, isOwner }: { project: Project; isOwner: boolean }) {
  const pct = project.total > 0 ? Math.round((project.done / project.total) * 100) : 0;

  return (
    <article className="group relative corner-frame border border-cyber-cyan/50 text-cyber-cyan bg-cyber-void/50 p-5 mb-3 transition-all duration-200 hover:shadow-neon-cyan">
      <span className="scan-sweep" />

      <div className="flex items-start gap-3.5">
        <div className="w-14 h-14 shrink-0 flex items-center justify-center border border-cyber-cyan/35 bg-cyber-void text-2xl">
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-[9.5px]">[TOP]</span>
            <h3
              data-text={project.title}
              className="glitch font-display text-[17px] uppercase tracking-wide text-steam-bright"
            >
              {project.title}
            </h3>
            <span className="font-mono text-[8.5px] uppercase px-1.5 py-0.5 border border-cyber-magenta text-cyber-magenta neon-pulse">
              destacado
            </span>
          </div>
          <p className="font-mono text-[11px] text-steam-dim mb-2 leading-relaxed">
            {project.description}
          </p>
          <TechChips tech={project.tech} />
        </div>
      </div>

      {project.longDescription ? (
        <p className="text-[12.5px] leading-relaxed text-steam-text/85 mt-4 pt-3.5 border-t border-cyber-cyan/15">
          {project.longDescription}
        </p>
      ) : null}

      <Screenshots ids={project.screenshotAssetIds} />

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {project.demoUrl ? (
          <ActionLink href={project.demoUrl} primary>
            Demo en vivo
          </ActionLink>
        ) : null}
        {project.repoUrl ? <ActionLink href={project.repoUrl}>Código</ActionLink> : null}
        {!project.demoUrl && !project.repoUrl && isOwner ? (
          <span className="font-mono text-[9.5px] text-steam-dim/60">
            Sin enlaces — cargalos en Modificar perfil → Proyectos.
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2.5 mt-4">
        <span className="font-mono text-[9.5px] text-steam-dim whitespace-nowrap">
          {String(project.done).padStart(2, "0")}/{String(project.total).padStart(2, "0")}
        </span>
        <div className="flex-1">
          <ProgressBar
            value={pct}
            className={
              pct === 100
                ? "bg-cyber-lime text-cyber-lime bar-glow"
                : "bg-cyber-cyan text-cyber-cyan bar-glow"
            }
            trackClassName="rounded-none bg-cyber-void/70 border border-cyber-cyan/15"
          />
        </div>
        <span className="font-mono text-[9.5px] text-steam-dim w-14 text-right">
          {pct === 100 ? "COMPLETO" : `${String(pct).padStart(3, "0")}%`}
        </span>
      </div>
    </article>
  );
}

/** Tarjeta compacta, plegable, para el resto de los proyectos. */
function CompactCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const hasDetail = Boolean(project.longDescription || project.screenshotAssetIds.length);
  const accent = accentFor(index + 1);

  return (
    <article
      className={`group relative corner-frame border ${accent.border} ${accent.text} ${accent.glow} bg-cyber-void/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5`}
    >
      <span className="scan-sweep" />

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-current/30 bg-cyber-void text-lg">
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            data-text={project.title}
            className="glitch font-display text-[13px] uppercase tracking-wide text-steam-bright leading-snug"
          >
            {project.title}
          </h3>
          <p className="font-mono text-[10px] text-steam-dim mt-1 mb-2 leading-relaxed">
            {project.description}
          </p>
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
            className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-steam-dim hover:text-cyber-cyan transition-colors"
          >
            {open ? "[ − ] menos" : "[ + ] detalle"}
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="mt-3 pt-3 border-t border-current/20">
          {project.longDescription ? (
            <p className="text-[12px] leading-relaxed text-steam-text/85">
              {project.longDescription}
            </p>
          ) : null}
          <Screenshots ids={project.screenshotAssetIds} />
        </div>
      ) : null}
    </article>
  );
}

/** Vitrina de proyectos: destacado arriba, el resto en grilla. */
export default function ProjectShowcase() {
  const { data } = usePortfolio();
  const { isOwner } = useAuth();
  const { projects } = data;

  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => p !== featured);

  return (
    <Panel
      id="proyectos"
      title="Vitrina"
      aside={<span className="text-cyber-cyan">{String(projects.length).padStart(2, "0")}</span>}
    >
      {projects.length === 0 ? (
        <p className="font-mono text-[10.5px] text-steam-dim">
          {isOwner
            ? "Sin proyectos. Cargalos en Modificar perfil → Proyectos."
            : "Sin proyectos publicados todavía."}
        </p>
      ) : (
        <>
          {featured ? <FeaturedCard project={featured} isOwner={isOwner} /> : null}
          {rest.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
              {rest.map((p, i) => (
                <CompactCard key={p.id} project={p} index={i} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </Panel>
  );
}
