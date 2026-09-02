"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import EditProfileDialog from "@/components/edit/EditProfileDialog";
import { usePortfolio, useAssetUrl } from "@/components/PortfolioProvider";
import AssetImage from "@/components/ui/AssetImage";

/**
 * Encabezado del perfil: avatar, identidad, chips de stack y las dos acciones
 * principales (ver CV y abrir el panel de edición).
 */
export default function Hero() {
  const { data } = usePortfolio();
  const { isOwner } = useAuth();
  const { profile } = data;

  const [editing, setEditing] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const cvUrl = useAssetUrl(data.cvAssetId);

  // El visor del CV también se cierra con Escape.
  useEffect(() => {
    if (!cvOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setCvOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cvOpen]);

  return (
    <div className="relative overflow-hidden flex flex-col lg:flex-row gap-7 bg-gradient-to-br from-steam-line/30 to-steam-panel/60 border border-steam-line p-7 mb-6">
      <div className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full bg-steam-link/10 blur-2xl" />

      {/* Avatar --------------------------------------------------------- */}
      {/* `self-start` evita que el contenedor se estire a la altura del flex:
          si se estira, la insignia de nivel (`-bottom-2.5`) se ancla al fondo
          estirado en vez de a la esquina del avatar. */}
      <div className="relative shrink-0 self-start">
        <div className="w-[150px] h-[150px] flex items-center justify-center border-2 border-steam-line bg-gradient-to-br from-red-500 to-purple-700 overflow-hidden transition-colors hover:border-steam-link">
          <AssetImage
            assetId={profile.avatarAssetId}
            alt={`Foto de perfil de ${profile.name}`}
            className="w-full h-full object-cover"
            fallback={
              <span className="font-display text-5xl text-white">
                {profile.name.charAt(0) || "?"}
              </span>
            }
          />
        </div>
        <div className="absolute -bottom-2.5 -right-2.5 w-9 h-9 rounded-full flex items-center justify-center border-2 border-steam-gold bg-steam-panel font-mono font-bold text-steam-gold text-sm">
          {profile.level}
        </div>
      </div>

      {/* Identidad ------------------------------------------------------ */}
      <div className="relative flex-1 min-w-0">
        <h1 className="font-display text-3xl text-steam-bright mb-1">{profile.name}</h1>
        <p className="font-mono text-sm text-steam-dim mb-1">{profile.role}</p>
        <p className="font-mono text-xs text-steam-dim/80 mb-3.5">{profile.location}</p>

        {profile.bio ? (
          <p className="text-[13px] leading-relaxed text-steam-text/90 max-w-2xl mb-4">
            {profile.bio}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2 mb-4">
          {profile.tags.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="text-[11px] px-2.5 py-1 border border-steam-line text-steam-dim font-mono tracking-wide transition-colors hover:border-steam-link hover:text-steam-link"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2.5 flex-wrap">
          {cvUrl ? (
            <button
              type="button"
              onClick={() => setCvOpen(true)}
              className="px-5 py-2 text-[12.5px] font-display uppercase tracking-wide border border-steam-link text-white bg-gradient-to-b from-[#2a5a7a] to-[#1c3c52] hover:from-[#347399] hover:to-[#25516f] transition-colors"
            >
              Ver CV
            </button>
          ) : isOwner ? (
            // Al visitante no le mostramos un botón muerto: si no hay CV, no
            // existe. El dueño sí lo ve, apagado, como recordatorio de subirlo.
            <span
              title="Subí tu CV desde Modificar perfil"
              className="px-5 py-2 text-[12.5px] font-display uppercase tracking-wide border border-steam-line text-steam-dim opacity-50 cursor-default"
            >
              Ver CV
            </span>
          ) : null}
          <a
            href="#proyectos"
            className="px-5 py-2 text-[12.5px] font-display uppercase tracking-wide border border-steam-line text-steam-dim hover:text-steam-bright hover:border-steam-link transition-colors"
          >
            Ver proyectos
          </a>
        </div>
      </div>

      {/* Acción de edición — sólo para el dueño.
          Esconder el botón es comodidad, NO seguridad: lo que impide que un
          visitante escriba son las policies RLS del servidor. */}
      {isOwner ? (
        <div className="relative shrink-0 self-start">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="bg-[#2a475e] text-[#66c0f4] hover:text-white hover:bg-[#417a9b] px-4 py-1.5 rounded-sm text-[12.5px] font-display uppercase tracking-wide transition-colors"
          >
            Modificar perfil
          </button>
        </div>
      ) : null}

      {editing && isOwner ? <EditProfileDialog onClose={() => setEditing(false)} /> : null}

      {/* Visor del CV ---------------------------------------------------- */}
      {cvOpen && cvUrl ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-8"
          onClick={() => setCvOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Curriculum Vitae"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl h-[85vh] bg-steam-panel border border-steam-line shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-steam-line to-steam-bgTop">
              <span className="text-steam-bright text-sm">Curriculum Vitae</span>
              <div className="flex items-center gap-3">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-steam-dim hover:text-steam-link transition-colors"
                >
                  Abrir en pestaña nueva
                </a>
                <button
                  type="button"
                  onClick={() => setCvOpen(false)}
                  aria-label="Cerrar"
                  className="text-steam-dim hover:text-white text-lg leading-none transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <iframe src={cvUrl} title="Curriculum Vitae" className="w-full h-[calc(100%-41px)]" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
