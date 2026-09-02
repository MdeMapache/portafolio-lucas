"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import Panel from "@/components/ui/Panel";

/** Comunidades y formación — el equivalente a los Grupos de Steam. */
export default function Groups() {
  const { data } = usePortfolio();
  const { groups } = data;

  if (groups.length === 0) return null;

  return (
    <Panel
      title="Comunidades"
      aside={<span className="text-steam-link font-mono">{groups.length}</span>}
    >
      {groups.map((group) => {
        const body = (
          <>
            <div className="w-[34px] h-[34px] shrink-0 flex items-center justify-center bg-steam-panel2 border border-steam-line text-[15px]">
              {group.icon}
            </div>
            <div className="min-w-0">
              <div className="text-[12.5px] text-steam-bright truncate">{group.name}</div>
              <div className="text-[10.5px] text-steam-dim truncate">{group.sub}</div>
            </div>
          </>
        );

        const rowClass =
          "flex gap-2.5 items-center py-2 border-b border-white/5 last:border-b-0 transition-colors";

        return group.url ? (
          <a
            key={group.id}
            href={group.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${rowClass} hover:bg-steam-panel2/50 -mx-2 px-2`}
          >
            {body}
          </a>
        ) : (
          <div key={group.id} className={rowClass}>
            {body}
          </div>
        );
      })}
    </Panel>
  );
}
