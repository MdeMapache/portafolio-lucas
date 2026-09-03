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
 * Comparte el lenguaje de chapa del panel de sección —placas biseladas,
 * remaches, recortes en diagonal y tira de estado— para que las dos mitades de
 * la pantalla se lean como piezas del mismo instrumental.
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
    <aside className="relative lg:sticky lg:top-0 lg:h-screen lg:w-[304px] shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-mw-phosphor/25 bg-mw-void/94 backdrop-blur-md">
      {/* Franja de peligro del borde. Vertical en escritorio, horizontal cuando
          el panel colapsa arriba. Va apagada: a intensidad plena compite con el
          contenido. */}
      <div
        aria-hidden
        className="hazard-stripe-dim absolute left-0 right-0 bottom-0 h-[3px] lg:left-auto lg:top-0 lg:bottom-0 lg:w-[3px] lg:h-auto z-10"
      />

      {/* Remaches de la chapa, en las esquinas del panel. */}
      {["top-2.5 left-2.5", "bottom-2.5 left-2.5"].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`hud-rivet hidden lg:block absolute ${pos} w-1.5 h-1.5 bg-mw-phosphor/70 text-mw-phosphor/40 z-10`}
        />
      ))}

      {/* Placa de identificación ------------------------------------------ */}
      <div className="flex items-stretch border-b border-mw-phosphor/20">
        <span className="hud-tab flex items-center bg-mw-phosphor/85 pl-4 pr-6 py-1.5">
          <span className="font-mono text-[10px] font-bold text-mw-void tracking-[0.25em]">
            PILOTO
          </span>
        </span>
        <span className="flex items-center gap-[3px] px-3 ml-auto" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="hud-segment w-[3px] h-2.5 bg-mw-phosphor"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </span>
      </div>

      {/* Identidad -------------------------------------------------------- */}
      <div className="p-5 border-b border-mw-phosphor/15">
        <div className="flex lg:flex-col lg:items-start items-center gap-4">
          <div className="relative shrink-0">
            {/* El avatar va con esquinas recortadas y escuadras, como una ficha
                de unidad y no como una foto de perfil cualquiera. */}
            <div className="mw-frame text-mw-phosphor/60 relative w-[76px] h-[76px] lg:w-[108px] lg:h-[108px]">
              <div className="hud-clip-sm w-full h-full border border-mw-phosphor/50 overflow-hidden bg-gradient-to-br from-mw-rust/40 to-mw-steel/40 flex items-center justify-center">
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
            </div>

            <span className="hud-clip-sm absolute -bottom-2 -right-2 w-9 h-9 flex items-center justify-center border border-mw-rust bg-mw-void font-mono text-[11px] font-bold text-mw-rust shadow-glow-rust">
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

            {/* Estado en placa recortada, no como texto suelto. */}
            <div
              className={`hud-clip-sm inline-flex items-center gap-2 mt-3 px-2.5 py-1 border ${
                profile.availableForWork
                  ? "border-mw-hazard/50 bg-mw-hazard/10"
                  : "border-steam-dim/30 bg-steam-dim/5"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  profile.availableForWork
                    ? "bg-mw-hazard shadow-glow-hazard neon-pulse"
                    : "bg-steam-dim"
                }`}
              />
              <span
                className={`font-mono text-[9.5px] uppercase tracking-[0.18em] ${
                  profile.availableForWork ? "text-mw-hazard" : "text-steam-dim"
                }`}
              >
                {profile.availableForWork ? "disponible" : "no disponible"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación ------------------------------------------------------- */}
      <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible lg:flex-1 p-2.5 lg:p-3">
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              aria-current={isActive ? "page" : undefined}
              className={`hud-clip-sm group relative shrink-0 text-left pl-2 pr-3 py-2 lg:py-2.5 border transition-all duration-200 ${
                isActive
                  ? "border-mw-phosphor/60 bg-mw-phosphor/12 text-steam-bright"
                  : "border-transparent text-steam-dim hover:border-mw-rust/50 hover:bg-mw-rust/5 hover:text-steam-bright"
              }`}
            >
              {/* Barra de selección: se estira desde cero al activarse, así el
                  cambio de sección se ve además de leerse. */}
              <span
                aria-hidden
                className={`absolute left-0 top-0 bottom-0 w-[3px] origin-top transition-transform duration-300 ${
                  isActive
                    ? "scale-y-100 bg-mw-phosphor shadow-glow-phosphor"
                    : "scale-y-0 bg-mw-rust group-hover:scale-y-100"
                }`}
              />

              <span className="flex items-baseline gap-2 ml-2">
                {/* Número en placa, como la del panel de sección. */}
                <span
                  className={`font-mono text-[9px] px-1 leading-[1.4] ${
                    isActive
                      ? "bg-mw-phosphor text-mw-void font-bold"
                      : "text-steam-dim/50 group-hover:text-mw-rust"
                  }`}
                >
                  {section.code}
                </span>

                {/* Selector ◄ ► del menú de unidades: marca el elegido sin
                    depender sólo del color de fondo. */}
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

              <span className="hidden lg:block font-mono text-[9.5px] text-steam-dim/50 mt-0.5 ml-[38px]">
                {section.hint}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Pie: acceso del dueño -------------------------------------------- */}
      <div className="hidden lg:block border-t border-mw-phosphor/15">
        <div className="flex items-center justify-between gap-2 p-3">
          {ready ? (
            isOwner ? (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="hud-clip-sm flex-1 px-3 py-1.5 font-display text-[11px] uppercase tracking-widest border border-mw-phosphor/60 bg-mw-phosphor/10 text-mw-phosphor hover:bg-mw-phosphor/20 hover:shadow-glow-phosphor transition-all"
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

        {/* Tira de estado, gemela de la del panel de sección. */}
        <div className="flex items-center gap-2 px-3 pb-2.5">
          <span aria-hidden className="hazard-stripe-dim h-[6px] flex-1 opacity-55" />
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-mw-phosphor/40 shrink-0">
            unidad lista
          </span>
        </div>
      </div>

      {signingIn ? <SignInDialog onClose={() => setSigningIn(false)} /> : null}
      {editing && isOwner ? <EditProfileDialog onClose={() => setEditing(false)} /> : null}
    </aside>
  );
}
