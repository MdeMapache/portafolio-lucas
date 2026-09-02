"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
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

function ExperienceCard({ item }: { item: Experience }) {
  const current = item.end === null;

  return (
    <li className="group relative pl-8 sm:pl-10 pb-5 last:pb-0">
      {/*
        Nodo sobre el cable. El `ring` lo separa del cable que pasa por detrás:
        sin él, el punto se funde con la línea y no se lee como un hito.
      */}
      <span
        aria-hidden
        className={`absolute left-[7px] sm:left-[11px] top-[7px] w-[9px] h-[9px] rotate-45 ring-4 ring-cyber-void ${
          current ? "bg-cyber-lime neon-pulse text-cyber-lime" : "bg-cyber-cyan/60 text-cyber-cyan"
        }`}
      />

      <article
        className={`relative corner-frame border bg-cyber-void/45 p-3.5 transition-all hover:-translate-y-0.5 ${
          current
            ? "border-cyber-lime/40 text-cyber-lime hover:shadow-neon-lime"
            : "border-cyber-cyan/30 text-cyber-cyan hover:shadow-neon-cyan"
        }`}
      >
        <span className="scan-sweep" />

        <header className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 mb-1.5">
          <h4
            data-text={item.role}
            className="glitch font-display text-[14.5px] uppercase tracking-wider text-steam-bright"
          >
            {item.role}
          </h4>
          <span className="font-mono text-[11px] text-current">@ {item.company}</span>
          {current ? (
            <span className="font-mono text-[8.5px] uppercase tracking-widest px-1.5 py-0.5 border border-current/50">
              activo
            </span>
          ) : null}
        </header>

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
      </article>
    </li>
  );
}

function EducationRow({ item }: { item: Education }) {
  const current = item.end === null;

  return (
    <li className="group flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 border-l-2 border-cyber-violet/40 pl-3 py-1.5 transition-colors hover:border-cyber-violet">
      <h4
        data-text={item.title}
        className="glitch font-display text-[13px] uppercase tracking-wider text-steam-bright"
      >
        {item.title}
      </h4>
      <span className="font-mono text-[11px] text-cyber-violet">{item.institution}</span>
      {current ? (
        <span className="font-mono text-[8.5px] uppercase tracking-widest px-1.5 py-0.5 border border-cyber-lime/50 text-cyber-lime">
          en curso
        </span>
      ) : null}
      <span className="font-mono text-[10px] text-steam-dim/60 w-full">
        {period(item.start, item.end)}
        <span className="mx-1.5 text-steam-dim/40">·</span>
        {item.location}
      </span>
    </li>
  );
}

/** Encabezado de bloque, con el prefijo `//` del resto del sitio. */
function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan/70 mb-3">
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
            className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-cyber-lime/50 via-cyber-cyan/35 to-transparent"
          />
          {experience.map((item) => (
            <ExperienceCard key={item.id} item={item} />
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
            <ul className="space-y-2">
              {education.map((item) => (
                <EducationRow key={item.id} item={item} />
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
                  className="font-mono text-[10px] px-2.5 py-1 border border-cyber-cyan/30 text-steam-dim tracking-wider transition-all hover:border-cyber-cyan hover:text-cyber-cyan hover:shadow-neon-cyan"
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
