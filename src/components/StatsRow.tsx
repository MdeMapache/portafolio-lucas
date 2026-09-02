"use client";

import { usePortfolio } from "@/components/PortfolioProvider";

export default function StatsRow() {
  const { data } = usePortfolio();
  const { stats } = data;

  if (stats.length === 0) return null;

  return (
    <div className="bg-steam-panel border border-white/5 mb-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 border border-steam-line">
        {stats.map((stat, i) => (
          <div
            key={stat.id}
            className={`text-center py-4 px-2 transition-colors hover:bg-steam-panel2/60 ${
              i !== stats.length - 1 ? "border-r border-steam-line" : ""
            }`}
          >
            <div className="font-display text-3xl text-steam-bright font-bold">{stat.num}</div>
            <div className="text-[11px] text-steam-dim uppercase tracking-wide mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
