"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { accentFor } from "@/components/ui/accents";

/** Color de la barra según el dominio, para que el nivel se lea de un vistazo. */
function barClassFor(level: number) {
  if (level >= 75) return "bg-cyber-lime text-cyber-lime bar-glow";
  if (level >= 50) return "bg-cyber-cyan text-cyber-cyan bar-glow";
  return "bg-cyber-magenta text-cyber-magenta bar-glow";
}

export default function TechStack() {
  const { data } = usePortfolio();
  const { techBadges, skills } = data;

  return (
    <>
      <Panel
        id="skills"
        title="Stack"
        aside={<span className="text-cyber-cyan">{String(techBadges.length).padStart(2, "0")}</span>}
      >
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {techBadges.map((badge, i) => {
            const accent = accentFor(i);
            return (
              <div
                key={badge.id}
                title={`${badge.label} · nivel ${badge.level}/5`}
                className={`group relative corner-frame aspect-square flex flex-col items-center justify-center border ${accent.border} ${accent.text} ${accent.glow} bg-cyber-void/40 transition-all duration-200 hover:-translate-y-0.5 cursor-default`}
              >
                <span className="scan-sweep" />
                <span className="font-mono text-[13px] font-bold tracking-wider">
                  {badge.label}
                </span>
                {/* Nivel como barras, no como número: se lee sin leer. */}
                <span className="flex gap-0.5 mt-1.5">
                  {Array.from({ length: 5 }, (_, n) => (
                    <span
                      key={n}
                      className={`w-1 h-1 ${n < badge.level ? "bg-current" : "bg-steam-dim/25"}`}
                    />
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Nivel de dominio">
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.id}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span
                  data-text={skill.name}
                  className="glitch font-mono text-[11px] text-steam-bright tracking-wide"
                >
                  {skill.name}
                </span>
                <span className="font-mono text-[10px] text-steam-dim">
                  {String(skill.level).padStart(3, "0")}%
                </span>
              </div>
              <ProgressBar
                value={skill.level}
                className={barClassFor(skill.level)}
                trackClassName="rounded-none bg-cyber-void/70 border border-cyber-cyan/15"
              />
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
