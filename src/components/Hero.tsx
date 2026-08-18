import { profile } from "@/data/portfolio";

export default function Hero() {
  return (
    <div className="relative overflow-hidden flex flex-col md:flex-row gap-7 items-start md:items-end bg-gradient-to-br from-steam-line/30 to-steam-panel/60 border border-steam-line p-7 mb-6">
      <div className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full bg-steam-link/10 blur-2xl" />

      <div className="relative flex-shrink-0">
        <div className="w-[150px] h-[150px] flex items-center justify-center border-2 border-steam-line bg-gradient-to-br from-red-500 to-purple-700 font-display text-5xl text-white">
          {profile.name.charAt(0)}
        </div>
        <div className="absolute -bottom-2.5 -right-2.5 w-9 h-9 rounded-full flex items-center justify-center border-2 border-steam-gold bg-steam-panel font-mono font-bold text-steam-gold text-sm">
          {profile.level}
        </div>
      </div>

      <div className="relative flex-1">
        <div className="font-display text-3xl text-steam-bright mb-1.5">{profile.name}</div>
        <div className="font-mono text-sm text-steam-dim mb-3.5">{profile.role}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 border border-steam-line text-steam-dim font-mono tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2.5">
          <a
            href="#"
            className="px-5 py-2 text-[12.5px] font-display uppercase tracking-wide border border-steam-link text-white bg-gradient-to-b from-[#2a5a7a] to-[#1c3c52] hover:from-[#347399] hover:to-[#25516f]"
          >
            Ver CV
          </a>
          <a
            href="#proyectos"
            className="px-5 py-2 text-[12.5px] font-display uppercase tracking-wide border border-steam-line text-steam-dim"
          >
            Ver proyectos
          </a>
        </div>
      </div>
    </div>
  );
}
