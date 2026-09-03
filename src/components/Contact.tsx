"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import Panel from "@/components/ui/Panel";
import { accentFor } from "@/components/ui/accents";

/** Canales de contacto, con el código del canal como etiqueta técnica. */
export default function Contact() {
  const { data } = usePortfolio();
  const { contacts, profile } = data;

  return (
    <Panel
      id="contacto"
      title="Canales"
      aside={
        <span
          className={
            profile.availableForWork ? "text-mw-hazard neon-pulse" : "text-steam-dim"
          }
        >
          {profile.availableForWork ? "ONLINE" : "AUSENTE"}
        </span>
      }
      bodyClassName="grid grid-cols-1 gap-2"
    >
      {contacts.map((contact, i) => {
        const accent = accentFor(i);

        const body = (
          <>
            <span className="scan-sweep" />
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] shrink-0 w-9">[{contact.code}]</span>
              <div className="min-w-0 flex-1">
                <div
                  data-text={contact.name}
                  className="glitch font-mono text-[11.5px] text-steam-bright break-all leading-snug"
                >
                  {contact.name}
                </div>
                <div className="font-mono text-[9.5px] text-steam-dim mt-0.5">{contact.role}</div>
              </div>
              <span
                className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                  contact.online ? "bg-mw-hazard neon-pulse" : "bg-steam-dim"
                }`}
              />
            </div>
          </>
        );

        const shell = `group relative corner-frame border ${accent.border} ${accent.text} ${accent.glow} bg-mw-void/40 px-3.5 py-2.5 transition-all duration-200 hover:-translate-y-0.5`;

        return contact.url ? (
          <a
            key={contact.id}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${shell} block`}
          >
            {body}
          </a>
        ) : (
          <div key={contact.id} className={shell}>
            {body}
          </div>
        );
      })}
    </Panel>
  );
}
