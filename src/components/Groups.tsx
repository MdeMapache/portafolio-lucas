"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import Panel from "@/components/ui/Panel";
import { accentFor } from "@/components/ui/accents";

/** Formación y comunidades. */
export default function Groups() {
  const { data } = usePortfolio();
  const { groups } = data;

  if (groups.length === 0) return null;

  return (
    <Panel
      title="Redes y formación"
      aside={<span className="text-steam-dim">{String(groups.length).padStart(2, "0")}</span>}
      bodyClassName="grid grid-cols-1 gap-2"
    >
      {groups.map((group, i) => {
        // Desfasamos el ciclo de color para que no quede igual que la columna
        // de al lado cuando ambas se ven en paralelo.
        const accent = accentFor(i + 2);

        const body = (
          <>
            <span className="scan-sweep" />
            <div className="flex items-center gap-3">
              <span className="text-base shrink-0">{group.icon}</span>
              <div className="min-w-0">
                <div
                  data-text={group.name}
                  className="glitch font-display text-[13px] uppercase tracking-wide text-steam-bright truncate"
                >
                  {group.name}
                </div>
                <div className="font-mono text-[9.5px] text-steam-dim truncate">{group.sub}</div>
              </div>
            </div>
          </>
        );

        const shell = `group relative corner-frame border ${accent.border} ${accent.text} ${accent.glow} bg-mw-void/40 px-3.5 py-2.5 transition-all duration-200 hover:-translate-y-0.5`;

        return group.url ? (
          <a
            key={group.id}
            href={group.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${shell} block`}
          >
            {body}
          </a>
        ) : (
          <div key={group.id} className={shell}>
            {body}
          </div>
        );
      })}
    </Panel>
  );
}
