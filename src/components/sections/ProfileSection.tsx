"use client";

import CvHologram from "@/components/CvHologram";
import { usePortfolio, useAssetUrl } from "@/components/PortfolioProvider";
import UnitCard from "@/components/ui/UnitCard";
import { accentFor } from "@/components/ui/accents";

/**
 * Perfil técnico.
 *
 * El texto usa la narrativa del juego pero NO inventa credenciales: todo lo que
 * afirma sale del CV real (Ingeniería Informática en Duoc UC, diplomado en
 * ciberseguridad terminado, certificación en modelado de datos, Godot, Angular
 * / Ionic). Un portafolio se usa para postular, y una skill inflada se cae en
 * la primera entrevista técnica.
 */

/**
 * El color de cada entrada no se declara acá: lo asigna `accentFor` según la
 * posición, y el ciclo ya arranca en óxido, fósforo, peligro y acero.
 *
 * `grade` es el rótulo de estado que va apoyado en el borde inferior de la
 * tarjeta, como el grado de un módulo en la pantalla de selección.
 */
const DOSSIER = [
  {
    code: "SEC",
    title: "Ciberseguridad",
    grade: "diplomado",
    body: "Diplomado en Ciberseguridad en Duoc UC, cursado entre 2025 y 2026. La formación se traduce en cómo escribo: validación del lado del servidor antes que del cliente, credenciales fuera del bundle, y permisos que se imponen en la base y no escondiendo botones en la interfaz.",
  },
  {
    code: "DAT",
    title: "Modelado de datos",
    grade: "certificado",
    body: "Certificación en Análisis y Desarrollo de Modelos de Datos. Diseño de esquemas relacionales, consultas SQL y decisiones sobre cuándo normalizar y cuándo no: este mismo portafolio guarda su documento como un jsonb en una sola fila porque se lee y se escribe entero.",
  },
  {
    code: "APP",
    title: "Full-Stack y móvil",
    grade: "operativo",
    body: "Angular e Ionic para híbridas multiplataforma, con autenticación, persistencia remota y notificaciones push. Del lado web, TypeScript y React sobre Next.js. Maquetación responsiva con foco en accesibilidad, de la etapa en desarrollo web.",
  },
  {
    code: "GAM",
    title: "Desarrollo de videojuegos",
    grade: "en producción",
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
            className="font-mono text-[10px] px-2.5 py-1 border border-mw-phosphor/30 text-steam-dim tracking-wider transition-all hover:border-mw-phosphor hover:text-mw-phosphor hover:shadow-glow-phosphor"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Dossier --------------------------------------------------------- */}
      <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-mw-phosphor/70 mb-3">
        {"// dossier técnico"}
      </h3>

      {/* `gap-6` y no menos: los rótulos van montados fuera del borde (título
          arriba, grado abajo), así que con poca separación los de dos tarjetas
          vecinas se tocan. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* El ciclo de acentos ya arranca en óxido, fósforo, peligro y acero —
            exactamente los colores que tenían asignados estas cuatro entradas,
            así que no hace falta declararlos por separado. */}
        {DOSSIER.map((entry, i) => (
          <UnitCard
            key={entry.code}
            code={entry.code}
            title={entry.title}
            accent={accentFor(i)}
            aside={entry.grade}
          >
            <p className="text-[12.5px] leading-relaxed text-steam-dim">{entry.body}</p>
          </UnitCard>
        ))}
      </div>

      {/* CV ---------------------------------------------------------------
          El PDF no se ofrece como un enlace suelto sino proyectado: ver
          CvHologram. Si no hay ninguno cargado, el proyector se muestra vacío. */}
      <CvHologram url={cvUrl} />
    </div>
  );
}
