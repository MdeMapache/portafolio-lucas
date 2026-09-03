"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import Panel from "@/components/ui/Panel";
import { accentFor } from "@/components/ui/accents";

/** Certificaciones formales, con el mismo lenguaje de tarjeta del dossier. */
export default function Certifications() {
  const { data } = usePortfolio();
  const { certifications } = data;

  if (certifications.length === 0) return null;

  return (
    <Panel
      title="Certificaciones"
      aside={<span className="text-steam-dim">{String(certifications.length).padStart(2, "0")}</span>}
      bodyClassName="grid grid-cols-1 gap-2"
    >
      {certifications.map((cert, i) => {
        const accent = accentFor(i);
        return (
          <article
            key={cert.id}
            className={`group relative corner-frame border ${accent.border} ${accent.text} ${accent.glow} bg-mw-void/40 px-3.5 py-2.5 transition-all duration-200 hover:-translate-y-0.5`}
          >
            <span className="scan-sweep" />
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[9.5px] shrink-0">[CRT]</span>
              <h3
                data-text={cert.name}
                className="glitch font-display text-[13px] uppercase tracking-wide text-steam-bright leading-snug"
              >
                {cert.name}
              </h3>
            </div>
            <p className="font-mono text-[9.5px] text-steam-dim mt-1 ml-[30px]">
              {cert.issuer}
              {cert.year ? ` · ${cert.year}` : ""}
            </p>
          </article>
        );
      })}
    </Panel>
  );
}
