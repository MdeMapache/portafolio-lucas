import { showcase } from "@/data/portfolio";
import SectionLabel from "./SectionLabel";

export default function ShowcaseGrid() {
  return (
    <>
      <SectionLabel id="proyectos" title="Expositor de proyectos" count={`${showcase.length} fijados`} />
      <div className="bg-steam-panel border border-white/5 p-5 mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {showcase.map((item) => (
            <div
              key={item.label}
              className="relative aspect-square flex items-center justify-center bg-steam-panel2 border border-steam-line text-3xl cursor-pointer transition-transform hover:-translate-y-1 hover:border-steam-link"
            >
              {item.icon}
              <span className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] font-mono text-steam-dim">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
