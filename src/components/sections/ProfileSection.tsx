"use client";

import CvHologram from "@/components/CvHologram";
import { usePortfolio, useAssetUrl } from "@/components/PortfolioProvider";

/**
 * Perfil técnico.
 *
 * El texto usa la narrativa ciberpunk pero NO inventa credenciales: todo lo que
 * afirma sale del CV real (Ingeniería Informática en Duoc UC, diplomado en
 * ciberseguridad terminado, certificación en modelado de datos, Godot, Angular
 * / Ionic). Un portafolio se usa para postular, y una skill inflada se cae en
 * la primera entrevista técnica.
 */

const DOSSIER = [
  {
    code: "SEC",
    title: "Ciberseguridad",
    accent: "text-cyber-magenta",
    border: "border-cyber-magenta/40",
    body: "Diplomado en Ciberseguridad en Duoc UC, cursado entre 2025 y 2026. La formación se traduce en cómo escribo: validación del lado del servidor antes que del cliente, credenciales fuera del bundle, y permisos que se imponen en la base y no escondiendo botones en la interfaz.",
  },
  {
    code: "DAT",
    title: "Modelado de datos",
    accent: "text-cyber-cyan",
    border: "border-cyber-cyan/40",
    body: "Certificación en Análisis y Desarrollo de Modelos de Datos. Diseño de esquemas relacionales, consultas SQL y decisiones sobre cuándo normalizar y cuándo no: este mismo portafolio guarda su documento como un jsonb en una sola fila porque se lee y se escribe entero.",
  },
  {
    code: "APP",
    title: "Full-Stack y móvil",
    accent: "text-cyber-lime",
    border: "border-cyber-lime/40",
    body: "Angular e Ionic para híbridas multiplataforma, con autenticación, persistencia remota y notificaciones push. Del lado web, TypeScript y React sobre Next.js. Maquetación responsiva con foco en accesibilidad, de la etapa en desarrollo web.",
  },
  {
    code: "GAM",
    title: "Desarrollo de videojuegos",
    accent: "text-cyber-violet",
    border: "border-cyber-violet/40",
    body: "Godot Engine y GDScript, en producción: juego 2D para Android con controles táctiles, object pooling para sostener el rendimiento en gama baja, IA de enemigos terrestres y voladores, y shaders propios. Arquitectura modular por sistemas.",
  },
];

export default function ProfileSection() {
  const { data } = usePortfolio();
  const { profile } = data;
  const cvUrl = useAssetUrl(data.cvAssetId);

  return (
    <div>
      {/* Bio ------------------------------------------------------------- */}
      <p className="text-[13.5px] leading-relaxed text-steam-text/90 max-w-3xl mb-5">
        {profile.bio}
      </p>

      <div className="flex flex-wrap gap-2 mb-7">
        {profile.tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="font-mono text-[10px] px-2.5 py-1 border border-cyber-cyan/30 text-steam-dim tracking-wider transition-all hover:border-cyber-cyan hover:text-cyber-cyan hover:shadow-neon-cyan"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Dossier --------------------------------------------------------- */}
      <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan/70 mb-3">
        {"// dossier técnico"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-7">
        {DOSSIER.map((entry) => (
          <article
            key={entry.code}
            className={`group border ${entry.border} bg-cyber-void/40 p-4 transition-all hover:-translate-y-0.5`}
          >
            <div className="flex items-baseline gap-2.5 mb-2">
              <span className={`font-mono text-[10px] ${entry.accent}`}>[{entry.code}]</span>
              <h4
                data-text={entry.title}
                className="glitch font-display text-[14px] uppercase tracking-wider text-steam-bright"
              >
                {entry.title}
              </h4>
            </div>
            <p className="text-[12.5px] leading-relaxed text-steam-dim">{entry.body}</p>
          </article>
        ))}
      </div>

      {/* CV ---------------------------------------------------------------
          El PDF no se ofrece como un enlace suelto sino proyectado: ver
          CvHologram. Si no hay ninguno cargado, el proyector se muestra vacío. */}
      <CvHologram url={cvUrl} />
    </div>
  );
}
