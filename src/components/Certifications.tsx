"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import Panel from "@/components/ui/Panel";

/**
 * Certificaciones formales — el equivalente a las Insignias de un perfil de
 * Steam: credenciales obtenidas, con quién las emitió y cuándo.
 */
export default function Certifications() {
  const { data } = usePortfolio();
  const { certifications } = data;

  if (certifications.length === 0) return null;

  return (
    <Panel
      title="Certificaciones"
      aside={<span className="text-steam-link font-mono">{certifications.length}</span>}
    >
      {certifications.map((cert) => (
        <div
          key={cert.id}
          className="flex gap-2.5 items-start py-2 border-b border-white/5 last:border-b-0"
        >
          <div className="w-[26px] h-[26px] shrink-0 mt-0.5 flex items-center justify-center border border-steam-gold/60 bg-steam-gold/10 text-[11px] text-steam-gold">
            ★
          </div>
          <div className="min-w-0">
            <div className="text-[12.5px] text-steam-bright leading-snug">{cert.name}</div>
            <div className="text-[10.5px] text-steam-dim">
              {cert.issuer}
              {cert.year ? ` · ${cert.year}` : ""}
            </div>
          </div>
        </div>
      ))}
    </Panel>
  );
}
