"use client";

import { useEffect, useState } from "react";
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
 * Navegación por paneles.
 *
 * No hay cambio de ruta: la sección se monta y desmonta en el cliente. El hash
 * de la URL se mantiene sincronizado para que un enlace directo o el botón de
 * atrás sigan funcionando.
 *
 * La transición es CSS y NO framer-motion, y el motivo es concreto: con
 * `AnimatePresence mode="wait"` el componente esperaba que el panel saliente
 * confirmara su salida antes de montar el nuevo. Si llegaba otro cambio de
 * sección durante esa espera —dos clics separados por menos que la duración de
 * la animación— el protocolo se rompía y el panel quedaba congelado en la
 * sección vieja de forma permanente, sin recuperarse ni con clics posteriores.
 *
 * Con `key={active}` React desmonta el viejo y monta el nuevo de inmediato, y
 * la animación de encendido corre sobre el que entra. No hay animación de
 * salida, que es justamente la que nadie nota y la que causaba el bloqueo.
 */
export default function SectionRouter() {
  const [active, setActive] = useState<SectionId>(DEFAULT_SECTION);

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
        {/* `key` fuerza el remonte, que es lo que reinicia las animaciones CSS
            de encendido tanto del marco como del contenido. */}
        <div key={active} className="hud-panel-in">
          <HudPanel code={meta?.code ?? ""} title={meta?.label ?? ""} hint={meta?.hint}>
            {/* El contenido entra 140 ms después del marco: primero se enciende
                la chapa y recién ahí aparece lo que muestra. */}
            <div className="hud-content-in">
              <Panel />
            </div>
          </HudPanel>
        </div>
      </main>
    </div>
  );
}
