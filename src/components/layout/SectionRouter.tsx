"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ContactSection from "@/components/sections/ContactSection";
import DemosSection from "@/components/sections/DemosSection";
import ProfileSection from "@/components/sections/ProfileSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import TrayectoriaSection from "@/components/sections/TrayectoriaSection";
import HudPanel from "@/components/ui/HudPanel";
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
          <motion.div
            key={active}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.995, y: -6 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <HudPanel code={meta?.code ?? ""} title={meta?.label ?? ""} hint={meta?.hint}>
              {/*
                El contenido entra un instante después del marco: primero se
                "enciende" la chapa y recién ahí aparece lo que muestra.

                La animación va en CSS y NO como un motion.div anidado. Un
                motion sin `exit` dentro de otro que sí sale bloquea a
                AnimatePresence en modo "wait": el padre espera que el hijo
                confirme su salida, el hijo nunca lo hace, y el panel nuevo no
                se monta nunca. Eso rompía la navegación por completo.
              */}
              <div className={reduceMotion ? undefined : "hud-content-in"}>
                <Panel />
              </div>
            </HudPanel>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
