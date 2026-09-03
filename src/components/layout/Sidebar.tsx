"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { usePortfolio } from "@/components/PortfolioProvider";
import SignInDialog from "@/components/SignInDialog";
import EditProfileDialog from "@/components/edit/EditProfileDialog";
import AssetImage from "@/components/ui/AssetImage";
import { SECTIONS, type SectionId } from "./sections";

/**
 * Panel izquierdo: identidad + navegación.
 *
 * En pantallas grandes queda fijo a la izquierda; abajo de `lg` se convierte en
 * una banda superior con el menú en scroll horizontal, para no comerse media
 * pantalla en un teléfono.
 */
export default function Sidebar({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  const { data } = usePortfolio();
  const { isOwner, ready, signOut } = useAuth();
  const { profile } = data;

  const [signingIn, setSigningIn] = useState(false);
  const [editing, setEditing] = useState(false);

  const handle = `${profile.name.replace(/\s+/g, "").toUpperCase()}.EXE`;

  return (
    <aside className="relative lg:sticky lg:top-0 lg:h-screen lg:w-[300px] shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-mw-phosphor/20 bg-mw-void/92 backdrop-blur-md">
      {/* Franja de peligro del borde, como la banda lateral del selector de
          unidades. Vertical en escritorio, horizontal cuando el panel colapsa
          arriba. Va apagada: a intensidad plena compite con el contenido. */}
      <div
        aria-hidden
        className="hazard-stripe-dim absolute left-0 right-0 bottom-0 h-[3px] lg:left-auto lg:top-0 lg:bottom-0 lg:w-[3px] lg:h-auto"
      />
      {/* Identidad ------------------------------------------------------- */}
      <div className="p-5 border-b border-mw-phosphor/15">
        <div className="flex lg:flex-col lg:items-start items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-[72px] h-[72px] lg:w-[104px] lg:h-[104px] border border-mw-phosphor/50 shadow-glow-phosphor overflow-hidden bg-gradient-to-br from-mw-rust/40 to-mw-steel/40 flex items-center justify-center">
              <AssetImage
                assetId={profile.avatarAssetId}
                alt={`Foto de perfil de ${profile.name}`}
                className="w-full h-full object-cover"
                fallback={
                  <span className="font-display text-3xl text-mw-phosphor">
                    {profile.name.charAt(0) || "?"}
                  </span>
                }
              />
            </div>
            <span className="absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center border border-mw-rust bg-mw-void font-mono text-[11px] font-bold text-mw-rust shadow-glow-rust">
              {profile.level}
            </span>
          </div>

          <div className="min-w-0 lg:mt-4">
            <p className="font-mono text-[10px] tracking-[0.2em] text-mw-phosphor/70 mb-1">
              {handle}
            </p>
            <h1
              data-text={profile.name}
              className="glitch font-display text-xl lg:text-2xl text-steam-bright leading-tight truncate"
            >
              {profile.name}
            </h1>
            <p className="font-mono text-[11px] text-steam-dim mt-1 leading-snug">{profile.role}</p>
            <p className="font-mono text-[10px] text-steam-dim/70">{profile.location}</p>

            <div className="flex items-center gap-2 mt-2.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  profile.availableForWork
                    ? "bg-mw-hazard shadow-glow-hazard neon-pulse"
                    : "bg-steam-dim"
                }`}
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-steam-dim">
                {profile.availableForWork ? "disponible" : "no disponible"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación ------------------------------------------------------ */}
      <nav className="flex lg:flex-col gap-0 overflow-x-auto lg:overflow-x-visible lg:flex-1 p-2 lg:p-3">
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              aria-current={isActive ? "page" : undefined}
              className={`group relative shrink-0 text-left px-3 py-2.5 lg:py-3 border-l-2 transition-all duration-200 ${
                isActive
                  ? "border-mw-phosphor bg-mw-phosphor/10 text-steam-bright"
                  : "border-transparent text-steam-dim hover:border-mw-rust hover:bg-mw-rust/5 hover:text-steam-bright"
              }`}
            >
              <span className="flex items-baseline gap-2">
                <span
                  className={`font-mono text-[10px] ${
                    isActive ? "text-mw-phosphor" : "text-steam-dim/50 group-hover:text-mw-rust"
                  }`}
                >
                  {section.code}
                </span>

                {/* Selector ◄ ► del menú de unidades de Metal Warriors: marca
                    el elegido sin depender sólo del color de fondo. */}
                <span
                  aria-hidden
                  className={`font-mono text-[10px] transition-opacity ${
                    isActive
                      ? "text-mw-phosphor phosphor-glow opacity-100"
                      : "opacity-0 group-hover:opacity-40"
                  }`}
                >
                  ◄
                </span>
                <span
                  data-text={section.label}
                  className="glitch font-display text-[13px] uppercase tracking-widest"
                >
                  {section.label}
                </span>
                <span
                  aria-hidden
                  className={`font-mono text-[10px] transition-opacity ${
                    isActive
                      ? "text-mw-phosphor phosphor-glow opacity-100"
                      : "opacity-0 group-hover:opacity-40"
                  }`}
                >
                  ►
                </span>
              </span>
              <span className="hidden lg:block font-mono text-[9.5px] text-steam-dim/50 mt-0.5 ml-[26px]">
                {section.hint}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Pie: acceso del dueño ------------------------------------------- */}
      <div className="hidden lg:flex items-center justify-between gap-2 p-3 border-t border-mw-phosphor/15">
        {ready ? (
          isOwner ? (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex-1 px-3 py-1.5 font-display text-[11px] uppercase tracking-widest border border-mw-phosphor/60 text-mw-phosphor hover:bg-mw-phosphor/10 hover:shadow-glow-phosphor transition-all"
              >
                Modificar
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="px-2.5 py-1.5 font-mono text-[10px] text-steam-dim hover:text-mw-rust transition-colors"
              >
                salir
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setSigningIn(true)}
              aria-label="Iniciar sesión"
              title="Acceso del dueño"
              className="ml-auto font-mono text-[10px] text-steam-dim/40 hover:text-mw-phosphor transition-colors"
            >
              [ ACCESO ]
            </button>
          )
        ) : null}
      </div>

      {signingIn ? <SignInDialog onClose={() => setSigningIn(false)} /> : null}
      {editing && isOwner ? <EditProfileDialog onClose={() => setEditing(false)} /> : null}
    </aside>
  );
}
