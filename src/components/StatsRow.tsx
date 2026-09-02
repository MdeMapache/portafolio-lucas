"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import { accentFor } from "@/components/ui/accents";

export default function StatsRow() {
  const { data } = usePortfolio();
  const { stats } = data;

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-7">
      {stats.map((stat, i) => {
        const accent = accentFor(i);
        return (
          // El color de acento va en el contenedor porque `corner-frame` dibuja
          // las escuadras con `currentColor`.
          <div
            key={stat.id}
            className={`group relative corner-frame border ${accent.border} ${accent.text} ${accent.glow} bg-cyber-void/40 p-4 text-center transition-all duration-200 hover:-translate-y-0.5`}
          >
            <span className="scan-sweep" />
            <div className="data-flicker font-display text-3xl font-bold leading-none">
              {stat.num}
            </div>
            <div className="font-mono text-[9px] text-steam-dim uppercase tracking-[0.18em] mt-2">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
