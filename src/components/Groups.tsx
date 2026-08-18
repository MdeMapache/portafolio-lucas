import { groups } from "@/data/portfolio";

export default function Groups() {
  return (
    <div className="bg-steam-panel border border-white/5 p-5 mb-5">
      <div className="flex justify-between text-[13px] text-steam-bright tracking-wide mb-2.5">
        <span>Comunidades</span>
        <span className="text-steam-link">{groups.length}</span>
      </div>
      {groups.map((g) => (
        <div key={g.name} className="flex gap-2.5 items-center py-2 border-b border-white/5 last:border-b-0">
          <div className="w-[34px] h-[34px] flex items-center justify-center bg-steam-panel2 border border-steam-line text-[15px]">
            {g.icon}
          </div>
          <div>
            <div className="text-[12.5px] text-steam-bright">{g.name}</div>
            <div className="text-[10.5px] text-steam-dim">{g.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
