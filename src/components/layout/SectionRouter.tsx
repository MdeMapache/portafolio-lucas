"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ContactSection from "@/components/sections/ContactSection";
import DemosSection from "@/components/sections/DemosSection";
import ProfileSection from "@/components/sections/ProfileSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import TrayectoriaSection from "@/components/sections/TrayectoriaSection";
import Sidebar from "./Sidebar";
import { DEFAULT_SECTION, SECTIONS, isSectionId, type SectionId } from "./sections";

const PANELS: Record<SectionId, React.ComponentType> = {
  perfil: ProfileSection,
  proyectos: ProjectsSection,
  demos: DemosSection,
  trayectoria: TrayectoriaSection,
  habilidades: SkillsSection,
  contacto: ContactSection,
};

/**
 * Navegación por paneles holográficos.
 *
 * No hay cambio de ruta: la sección se monta y desmonta en el cliente, con una
 * animación de "pantalla encendiéndose" (fade + scale-up + parpadeo de tubo).
 * El hash de la URL se mantiene sincronizado para que un enlace directo o el
 * botón de atrás sigan funcionando.
 */
export default function SectionRouter() {
  const [active, setActive] = useState<SectionId>(DEFAULT_SECTION);
  const reduceMotion = useReducedMotion();

  // Lee el hash al montar y escucha los cambios (botón atrás del navegador).
  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash.slice(1);
      if (isSectionId(hash)) setActive(hash);
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function select(id: SectionId) {
    setActive(id);
    // replaceState y no hash directo: evita que cada clic sume una entrada al
    // historial y obligue a apretar atrás cinco veces para salir.
    window.history.replaceState(null, "", `#${id}`);
  }

  const Panel = PANELS[active];
  const meta = SECTIONS.find((s) => s.id === active);

  return (
    <div className="relative z-[1] flex flex-col lg:flex-row min-h-screen">
      <Sidebar active={active} onSelect={select} />

      {/* `pt-14` deja libre la franja donde flota el control de audio, para que
          no se monte sobre la cabecera del panel. */}
      <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-9 pt-14 sm:pt-14 lg:pt-14">
        <AnimatePresence mode="wait">
          <motion.section
            key={active}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99, y: -4 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            // La opacidad alta no es negociable: con un GIF de alto contraste
            // detrás, el blur solo no alcanza y el texto se vuelve ilegible.
            // Lo holográfico lo dan el borde neón, el blur y la animación.
            className="holo-edge relative overflow-hidden bg-mw-void/88 backdrop-blur-xl border border-mw-phosphor/25 p-4 sm:p-6"
          >
            {/* Cabecera del panel: número y nombre de la sección. */}
            <header className="flex items-baseline gap-3 pb-3 mb-5 border-b border-mw-phosphor/20">
              <span className="font-mono text-[11px] text-mw-phosphor">{meta?.code}</span>
              <h2
                data-text={meta?.label}
                className="glitch font-display text-lg uppercase tracking-[0.2em] text-steam-bright"
              >
                {meta?.label}
              </h2>
              <span className="ml-auto font-mono text-[10px] text-steam-dim/60 hidden sm:inline">
                {meta?.hint}
              </span>
            </header>

            <div className={reduceMotion ? undefined : "holo-flicker"}>
              <Panel />
            </div>
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}
