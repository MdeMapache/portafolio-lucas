import { contacts } from "@/data/portfolio";

export default function Contact() {
  return (
    <div className="bg-steam-panel border border-white/5 p-5" id="contacto">
      <div className="flex justify-between text-[13px] text-steam-bright tracking-wide mb-2.5">
        <span>Contacto</span>
        <span className="text-steam-link">online</span>
      </div>
      {contacts.map((c) => (
        <div key={c.name} className="flex items-center gap-2.5 py-2.5 border-b border-white/5 last:border-b-0">
          <div className="relative w-8 h-8 flex items-center justify-center bg-steam-panel2 border border-steam-line text-sm">
            {c.code}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-steam-panel ${
                c.online ? "bg-steam-green" : "bg-steam-line"
              }`}
            />
          </div>
          <div>
            <div className="text-[12.5px] text-steam-link">{c.name}</div>
            <div className="text-[10.5px] text-steam-dim">{c.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
