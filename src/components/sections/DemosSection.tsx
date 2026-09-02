"use client";

import { useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import type { Project } from "@/lib/portfolio/types";

/**
 * Demos en vivo.
 *
 * Los demos no son un modelo aparte: cualquier proyecto con `demoUrl` cargado
 * aparece acá embebido. Así se editan desde el mismo lugar que todo lo demás
 * (Modificar perfil → Proyectos) y no hay dos listas que mantener en sincronía.
 */
function DemoFrame({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!project.demoUrl) return null;

  return (
    <article className="border border-cyber-cyan/25 bg-cyber-void/50 transition-shadow hover:shadow-neon-cyan">
      <header className="flex items-center gap-2.5 px-3 py-2 border-b border-cyber-cyan/20 bg-cyber-cyan/5">
        <span className="text-base">{project.icon}</span>
        <h3
          data-text={project.title}
          className="glitch font-display text-[13px] uppercase tracking-wider text-steam-bright truncate"
        >
          {project.title}
        </h3>
        <div className="ml-auto flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="font-mono text-[10px] text-steam-dim hover:text-cyber-cyan transition-colors"
          >
            {expanded ? "[ − ]" : "[ + ]"}
          </button>
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-cyber-cyan hover:text-cyber-magenta transition-colors"
          >
            ABRIR ↗
          </a>
        </div>
      </header>

      <div className={`relative bg-black ${expanded ? "h-[70vh]" : "h-[300px]"} transition-[height]`}>
        {!loaded ? (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-cyber-cyan/60">
            <span className="animate-pulse">CONECTANDO…</span>
          </div>
        ) : null}

        {/*
          `sandbox` limita lo que el sitio embebido puede hacer: sin acceso al
          documento padre ni a la sesión de este origen. `allow-same-origin`
          es necesario para que la mayoría de las apps arranquen.
        */}
        <iframe
          src={project.demoUrl}
          title={`Demo de ${project.title}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer"
          className="w-full h-full border-0"
        />
      </div>

      <footer className="px-3 py-2 border-t border-cyber-cyan/15">
        <p className="font-mono text-[10px] text-steam-dim/70 leading-relaxed">
          {project.description}
        </p>
      </footer>
    </article>
  );
}

export default function DemosSection() {
  const { data } = usePortfolio();
  const withDemo = data.projects.filter((p) => p.demoUrl);

  return (
    <div>
      <p className="font-mono text-[11px] text-steam-dim/80 leading-relaxed mb-5">
        Aplicaciones corriendo en vivo, embebidas directamente. Si un demo aparece en blanco, el
        sitio bloquea el embebido por cabecera{" "}
        <code className="text-cyber-cyan">X-Frame-Options</code> — usá{" "}
        <span className="text-cyber-cyan">ABRIR ↗</span> para verlo en pestaña propia.
      </p>

      {withDemo.length === 0 ? (
        <div className="border border-dashed border-cyber-cyan/25 p-8 text-center">
          <p className="font-mono text-[11px] text-steam-dim">
            Sin demos publicados todavía.
          </p>
          <p className="font-mono text-[10px] text-steam-dim/60 mt-2">
            Cargá la URL de un proyecto en Modificar perfil → Proyectos → Demo en vivo y aparece acá
            solo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {withDemo.map((project) => (
            <DemoFrame key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
