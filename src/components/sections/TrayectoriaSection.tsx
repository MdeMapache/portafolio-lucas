"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import UnitCard from "@/components/ui/UnitCard";
import { canvasModeFor } from "@/components/ui/UnitCanvas";
import { ACCENT_HAZARD, ACCENT_PHOSPHOR, ACCENT_STEEL } from "@/components/ui/accents";
import type { Education, Experience } from "@/lib/portfolio/types";

/**
 * Trayectoria: experiencia laboral, formación e idiomas.
 *
 * Todo sale del CV real. La sección no inventa fechas ni responsabilidades:
 * si un campo está vacío, se muestra vacío en vez de rellenarlo.
 *
 * La línea de tiempo es una columna con un "cable" de neón y un nodo por
 * puesto. Los puestos vigentes (`end === null`) llevan el nodo pulsando y una
 * etiqueta ACTIVO — es la única jerarquía visual que hace falta para que se
 * entienda de un vistazo qué está corriendo ahora.
 */

/** "May. 2026 — Actualmente" / "May. 2025 — Sep. 2025". */
function period(start: string, end: string | null) {
  return `${start} — ${end ?? "Actualmente"}`;
}

function ExperienceCard({ item, index }: { item: Experience; index: number }) {
  const current = item.end === null;

  return (
    <li className="group relative pl-8 sm:pl-10 pb-6 last:pb-0">
      {/*
        Nodo sobre el cable. El `ring` lo separa del cable que pasa por detrás:
        sin él, el punto se funde con la línea y no se lee como un hito.
      */}
      <span
        aria-hidden
        className={`absolute left-[7px] sm:left-[11px] top-[10px] w-[9px] h-[9px] rotate-45 ring-4 ring-mw-void ${
          current ? "bg-mw-hazard neon-pulse text-mw-hazard" : "bg-mw-phosphor/60 text-mw-phosphor"
        }`}
      />

      {/* El color comunica estado, no ritmo: amarillo si el puesto sigue
          vigente, fósforo si terminó. */}
      <UnitCard
        code={`E${String(index + 1).padStart(2, "0")}`}
        title={item.role}
        accent={current ? ACCENT_HAZARD : ACCENT_PHOSPHOR}
        canvas={canvasModeFor(index)}
        aside={current ? "activo" : "finalizado"}
      >
        <p className="font-mono text-[11px] text-current mb-1">@ {item.company}</p>

        <p className="font-mono text-[10px] text-steam-dim/70 mb-2.5">
          {period(item.start, item.end)}
          <span className="mx-1.5 text-steam-dim/40">·</span>
          {item.location}
        </p>

        {item.summary ? (
          <p className="text-[12.5px] leading-relaxed text-steam-text/85 mb-2">{item.summary}</p>
        ) : null}

        {item.highlights.length > 0 ? (
          <ul className="space-y-1">
            {item.highlights.map((line, i) => (
              <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-steam-dim">
                <span aria-hidden className="text-current/60 shrink-0 font-mono text-[10px] mt-[3px]">
                  ▸
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </UnitCard>
    </li>
  );
}

function EducationRow({ item, index }: { item: Education; index: number }) {
  const current = item.end === null;

  return (
    <li>
      <UnitCard
        code={`F${String(index + 1).padStart(2, "0")}`}
        title={item.title}
        accent={current ? ACCENT_HAZARD : ACCENT_STEEL}
        canvas={canvasModeFor(index + 2)}
        aside={current ? "en curso" : "completada"}
      >
        <p className="font-mono text-[11px] text-current mb-1">{item.institution}</p>
        <p className="font-mono text-[10px] text-steam-dim/60">
          {period(item.start, item.end)}
          <span className="mx-1.5 text-steam-dim/40">·</span>
          {item.location}
        </p>
      </UnitCard>
    </li>
  );
}

/** Encabezado de bloque, con el prefijo `//` del resto del sitio. */
function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-mw-phosphor/70 mb-3">
      {"// "}
      {children}
    </h3>
  );
}

export default function TrayectoriaSection() {
  const { data } = usePortfolio();
  const { experience, education, languages } = data;

  return (
    <div>
      {/* Experiencia ------------------------------------------------------ */}
      <BlockTitle>experiencia laboral</BlockTitle>

      {experience.length === 0 ? (
        <p className="font-mono text-[10.5px] text-steam-dim/60 mb-7">
          Sin experiencia cargada. Se agrega en Modificar perfil → Trayectoria.
        </p>
      ) : (
        <ol className="relative mb-8">
          {/*
            El cable. Va como elemento aparte y no como `border-left` de la
            lista para poder cortarlo antes del último nodo: una línea que sigue
            de largo hasta el borde del panel parece un error de maquetación.
          */}
          <span
            aria-hidden
            className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-mw-hazard/50 via-mw-phosphor/35 to-transparent"
          />
          {experience.map((item, i) => (
            <ExperienceCard key={item.id} item={item} index={i} />
          ))}
        </ol>
      )}

      {/* Formación e idiomas ---------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-x-8 gap-y-7">
        <section>
          <BlockTitle>formación</BlockTitle>
          {education.length === 0 ? (
            <p className="font-mono text-[10.5px] text-steam-dim/60">Sin formación cargada.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-6">
              {education.map((item, i) => (
                <EducationRow key={item.id} item={item} index={i} />
              ))}
            </ul>
          )}
        </section>

        <section>
          <BlockTitle>idiomas</BlockTitle>
          {languages.length === 0 ? (
            <p className="font-mono text-[10.5px] text-steam-dim/60">Sin idiomas cargados.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <li
                  key={lang.id}
                  className="font-mono text-[10px] px-2.5 py-1 border border-mw-phosphor/30 text-steam-dim tracking-wider transition-all hover:border-mw-phosphor hover:text-mw-phosphor hover:shadow-glow-phosphor"
                >
                  {lang.name}
                  {/* Sin nivel declarado no se inventa uno: se marca el hueco. */}
                  <span className="ml-1.5 text-steam-dim/50">
                    {lang.level || "— nivel sin declarar"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
