"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { usePortfolio } from "@/components/PortfolioProvider";
import AssetImage from "@/components/ui/AssetImage";
import ExpandableText from "@/components/ui/ExpandableText";
import Panel from "@/components/ui/Panel";
import SegmentedBar from "@/components/ui/SegmentedBar";
import SpecGrid from "@/components/ui/SpecGrid";
import UnitCard from "@/components/ui/UnitCard";
import { canvasModeFor } from "@/components/ui/UnitCanvas";
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

/** Estado operativo, en la jerga del panel. */
function statusOf(project: Project) {
  const pct = progressOf(project);
  if (pct === 100) return "OPERATIVO";
  if (pct >= 50) return "EN PRUEBAS";
  return "EN TALLER";
}

/** Botón de acción con relieve de chapa. */
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
      className={`hud-clip-sm shadow-plate px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-all hover:-translate-y-px ${
        primary
          ? "border-mw-hazard/60 bg-mw-hazard/12 text-mw-hazard hover:bg-mw-hazard/25 hover:shadow-glow-hazard"
          : "border-steam-line bg-steam-panel2/60 text-steam-dim hover:border-mw-steel hover:text-mw-steelLight"
      }`}
    >
      {children} ↗
    </a>
  );
}

/** Placa del icono, con relieve y esquinas recortadas. */
function IconPlate({ icon, large = false }: { icon: string; large?: boolean }) {
  return (
    <div
      className={`hud-clip-sm shadow-plate shrink-0 flex items-center justify-center border border-current/30 bg-mw-fieldDeep ${
        large ? "w-16 h-16 text-3xl" : "w-11 h-11 text-xl"
      }`}
    >
      {icon}
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
          className="hud-clip-sm w-32 h-20 border border-current/30 overflow-hidden bg-black transition-all hover:border-current"
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

/**
 * Ficha de datos más barra segmentada.
 *
 * Es lo que le da cuerpo a la tarjeta: antes el cuerpo era una línea de
 * descripción y una barra lisa, que es exactamente lo que se ve en cualquier
 * sitio. Con la ficha rotulada la tarjeta pasa a leerse como la hoja de una
 * unidad.
 */
function UnitSpecs({ project }: { project: Project }) {
  const pct = progressOf(project);
  const complete = pct === 100;

  return (
    <>
      <SpecGrid
        className="mt-3"
        items={[
          { label: "stack", value: project.tech[0] ?? "—" },
          { label: "estado", value: statusOf(project) },
          {
            label: "tareas",
            value: `${String(project.done).padStart(2, "0")}/${String(project.total).padStart(2, "0")}`,
          },
        ]}
      />

      <div className="flex items-center gap-2.5 mt-2.5">
        <SegmentedBar
          value={pct}
          className={`flex-1 ${complete ? "text-mw-phosphor" : "text-mw-hazard"}`}
        />
        <span
          className={`font-mono text-[9.5px] w-12 text-right tabular-nums ${
            complete ? "text-mw-phosphor" : "text-steam-dim"
          }`}
        >
          {String(pct).padStart(3, "0")}%
        </span>
      </div>
    </>
  );
}

/** Chips de tecnologías secundarias: la primera ya aparece en la ficha. */
function TechChips({ tech }: { tech: string[] }) {
  const rest = tech.slice(1);
  if (rest.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {rest.map((t) => (
        <span
          key={t}
          className="font-mono text-[9px] px-1.5 py-0.5 text-steam-dim border border-steam-line/70 tracking-wider uppercase"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

/** Unidad destacada: mismo marco que el resto, mayor escala. */
function FeaturedCard({ project, isOwner }: { project: Project; isOwner: boolean }) {
  return (
    <UnitCard
      code="TOP"
      title={project.title}
      accent={accentFor(0)}
      canvas="radar"
      size="lg"
      aside={`destacado · ${gradeOf(project)}`}
      className="mb-6"
    >
      <div className="flex items-start gap-4">
        <IconPlate icon={project.icon} large />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] text-steam-text/85 leading-relaxed">
            {project.description}
          </p>
          <TechChips tech={project.tech} />
        </div>
      </div>

      <UnitSpecs project={project} />

      {project.longDescription ? (
        <div className="mt-3.5 pt-3 border-t border-current/15">
          <ExpandableText lines={2} className="text-[12.5px] leading-relaxed text-steam-dim">
            {project.longDescription}
          </ExpandableText>
        </div>
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
      accent={accentFor(index + 1)}
      canvas={canvasModeFor(index + 1)}
      aside={gradeOf(project)}
    >
      <div className="flex items-start gap-3">
        <IconPlate icon={project.icon} />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] text-steam-text/80 leading-relaxed">
            {project.description}
          </p>
          <TechChips tech={project.tech} />
        </div>
      </div>

      <UnitSpecs project={project} />

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
            className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-steam-dim hover:text-mw-steelLight transition-colors"
          >
            {open ? "[ − ] menos" : "[ + ] detalle"}
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="mt-3 pt-3 border-t border-current/20">
          {project.longDescription ? (
            <p className="text-[12px] leading-relaxed text-steam-dim">{project.longDescription}</p>
          ) : null}
          <Screenshots ids={project.screenshotAssetIds} />
        </div>
      ) : null}
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
      aside={<span className="text-steam-dim">{String(projects.length).padStart(2, "0")}</span>}
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
            // `gap-6`: los rótulos van montados fuera del borde de cada tarjeta.
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
