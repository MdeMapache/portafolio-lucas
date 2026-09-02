"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import Panel from "@/components/ui/Panel";

/** Redes sociales y contacto, con el punto de estado al estilo de Steam. */
export default function Contact() {
  const { data } = usePortfolio();
  const { contacts, profile } = data;

  return (
    <Panel
      id="contacto"
      title="Contacto"
      aside={
        <span className={profile.availableForWork ? "text-steam-green" : "text-steam-dim"}>
          {profile.availableForWork ? "online" : "ausente"}
        </span>
      }
    >
      {contacts.map((contact) => {
        const body = (
          <>
            <div className="relative w-8 h-8 shrink-0 flex items-center justify-center bg-steam-panel2 border border-steam-line text-sm font-mono">
              {contact.code}
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-steam-panel ${
                  contact.online ? "bg-steam-green" : "bg-steam-line"
                }`}
              />
            </div>
            <div className="min-w-0">
              <div
                className={`text-[12.5px] break-all ${
                  contact.url ? "text-steam-link group-hover:text-steam-linkHover" : "text-steam-text"
                }`}
              >
                {contact.name}
              </div>
              <div className="text-[10.5px] text-steam-dim">{contact.role}</div>
            </div>
          </>
        );

        const rowClass =
          "group flex items-center gap-2.5 py-2.5 border-b border-white/5 last:border-b-0 transition-colors";

        return contact.url ? (
          <a
            key={contact.id}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${rowClass} hover:bg-steam-panel2/50 -mx-2 px-2`}
          >
            {body}
          </a>
        ) : (
          <div key={contact.id} className={rowClass}>
            {body}
          </div>
        );
      })}
    </Panel>
  );
}
