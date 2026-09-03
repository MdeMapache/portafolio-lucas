"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { usePortfolio } from "@/components/PortfolioProvider";
import AssetImage from "@/components/ui/AssetImage";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import UnitCard from "@/components/ui/UnitCard";
import { accentFor } from "@/components/ui/accents";
import type { Project } from "@/lib/portfolio/types";

/** Porcentaje de avance, tolerando un total en cero. */
function progressOf(project: Project) {
  return project.total > 0 ? Math.round((project.done / project.total) * 100) : 0;
}

/** Rótulo de estado para el borde inferior de la tarjeta. */
function gradeOf(project: Project) {
  const pct = progressOf(project);
  return pct === 100 ? "completo" : `avance ${String(pct).padStart(3, "0")}%`;
}

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
          ? "border-mw-phosphor text-mw-phosphor hover:bg-mw-phosphor/10 hover:shadow-glow-phosphor"
          : "border-steam-dim/40 text-steam-dim hover:border-mw-rust hover:text-mw-rust hover:shadow-glow-rust"
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
          className="w-32 h-20 border border-mw-phosphor/25 overflow-hidden bg-black transition-all hover:border-mw-phosphor hover:shadow-glow-phosphor"
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

/** Barra de avance con el conteo de tareas a los costados. */
function ProgressRow({ project }: { project: Project }) {
  const pct = progressOf(project);
  const complete = pct === 100;

  return (
    <div className="flex items-center gap-2.5 mt-4">
      <span className="font-mono text-[9.5px] text-steam-dim whitespace-nowrap">
        {String(project.done).padStart(2, "0")}/{String(project.total).padStart(2, "0")}
      </span>
      <div className="flex-1">
        <ProgressBar
          value={pct}
          className={
            complete
              ? "bg-mw-hazard text-mw-hazard bar-glow"
              : "bg-mw-phosphor text-mw-phosphor bar-glow"
          }
          trackClassName="rounded-none bg-mw-void/70 border border-mw-phosphor/15"
        />
      </div>
      <span
        className={`font-mono text-[9.5px] w-14 text-right ${
          complete ? "text-mw-hazard" : "text-steam-dim"
        }`}
      >
        {complete ? "COMPLETO" : `${String(pct).padStart(3, "0")}%`}
      </span>
    </div>
  );
}

/** Unidad destacada: mismo marco que el resto, mayor escala. */
function FeaturedCard({ project, isOwner }: { project: Project; isOwner: boolean }) {
  return (
    <UnitCard
      code="TOP"
      title={project.title}
      accent={accentFor(1)}
      size="lg"
      aside={`destacado · ${gradeOf(project)}`}
      className="mb-6"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-14 h-14 shrink-0 flex items-center justify-center border border-current/35 bg-mw-void text-2xl">
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] text-steam-dim mb-2 leading-relaxed">
            {project.description}
          </p>
          <TechChips tech={project.tech} />
        </div>
      </div>

      {project.longDescription ? (
        <p className="text-[12.5px] leading-relaxed text-steam-text/85 mt-4 pt-3.5 border-t border-current/15">
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

      <ProgressRow project={project} />
    </UnitCard>
  );
}

/** Unidad compacta, plegable. */
function CompactCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const hasDetail = Boolean(project.longDescription || project.screenshotAssetIds.length);

  return (
    <UnitCard
      // El código numera la unidad dentro de la vitrina; el 01 es el destacado.
      code={String(index + 2).padStart(2, "0")}
      title={project.title}
      accent={accentFor(index + 2)}
      aside={gradeOf(project)}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-current/30 bg-mw-void text-lg">
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] text-steam-dim mb-2 leading-relaxed">
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
            className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-steam-dim hover:text-mw-phosphor transition-colors"
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

      <ProgressRow project={project} />
    </UnitCard>
  );
}

/** Vitrina de proyectos: unidad destacada arriba, el resto en grilla. */
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
      aside={<span className="text-mw-phosphor">{String(projects.length).padStart(2, "0")}</span>}
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
            // `gap-6`: los rótulos van montados fuera del borde de cada tarjeta,
            // así que con menos separación los de dos vecinas se tocan.
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
