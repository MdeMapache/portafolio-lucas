"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";

export default function TechStack() {
  const { data } = usePortfolio();
  const { techBadges, skills } = data;

  return (
    <Panel
      id="skills"
      title="Stack tecnológico"
      aside={<span className="text-steam-link font-mono">{techBadges.length}</span>}
    >
      <div className="grid grid-cols-5 gap-2 mb-5">
        {techBadges.map((badge) => (
          <div
            key={badge.id}
            title={`${badge.label} · nivel ${badge.level}/5`}
            className="relative aspect-square flex items-center justify-center bg-steam-panel2 border border-steam-line text-[15px] transition-all hover:-translate-y-0.5 hover:border-steam-link cursor-default"
          >
            {badge.label}
            <span className="absolute bottom-0.5 right-0.5 text-[7px] font-mono text-steam-gold">
              {badge.level}
            </span>
          </div>
        ))}
      </div>

      <div className="text-[13px] text-steam-bright tracking-wide mb-2.5">Nivel de dominio</div>
      {skills.map((skill) => (
        <div key={skill.id} className="mb-2.5">
          <div className="flex justify-between text-xs mb-1">
            <span>{skill.name}</span>
            <span className="font-mono text-[10.5px] text-steam-dim">{skill.level}%</span>
          </div>
          <ProgressBar value={skill.level} className="bg-steam-green" />
        </div>
      ))}
    </Panel>
  );
}
