import { stats } from "@/data/portfolio";

export default function StatsRow() {
  return (
    <div className="bg-steam-panel border border-white/5 mb-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 border border-steam-line">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`text-center py-4 px-2 ${i !== stats.length - 1 ? "border-r border-steam-line" : ""}`}
          >
            <div className="font-display text-3xl text-steam-bright font-bold">{s.num}</div>
            <div className="text-[11px] text-steam-dim uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
