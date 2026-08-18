import { techBadges, skills } from "@/data/portfolio";

export default function TechStack() {
  return (
    <div className="bg-steam-panel border border-white/5 p-5 mb-5" id="skills">
      <div className="flex justify-between text-[13px] text-steam-bright tracking-wide mb-2.5">
        <span>Stack tecnológico</span>
        <span className="text-steam-link">{techBadges.length}</span>
      </div>
      <div className="grid grid-cols-5 gap-2 mb-5">
        {techBadges.map((b) => (
          <div
            key={b.label}
            className="relative aspect-square flex items-center justify-center bg-steam-panel2 border border-steam-line text-[15px]"
          >
            {b.label}
            <span className="absolute bottom-0.5 right-0.5 text-[7px] font-mono text-steam-gold">
              {b.level}
            </span>
          </div>
        ))}
      </div>

      <div className="text-[13px] text-steam-bright tracking-wide mb-2.5">Nivel de dominio</div>
      {skills.map((s) => (
        <div key={s.name} className="mb-2.5">
          <div className="flex justify-between text-xs mb-1">
            <span>{s.name}</span>
            <span className="font-mono text-[10.5px] text-steam-dim">{s.level}%</span>
          </div>
          <div className="h-[5px] rounded-full bg-steam-panel2 overflow-hidden">
            <div className="h-full bg-steam-green" style={{ width: `${s.level}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
