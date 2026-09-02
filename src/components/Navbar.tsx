"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { usePortfolio } from "@/components/PortfolioProvider";
import SignInDialog from "@/components/SignInDialog";
import AssetImage from "@/components/ui/AssetImage";

const LINKS = [
  { href: "#perfil", label: "Perfil" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#skills", label: "Habilidades" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const { data } = usePortfolio();
  const { isOwner, ready, signOut } = useAuth();
  const { profile } = data;

  const [signingIn, setSigningIn] = useState(false);

  // "MAPACHE.DEV" a partir del nombre real, sin espacios.
  const brand = `${profile.name.replace(/\s+/g, "").toUpperCase()}.DEV`;

  return (
    <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-black/40 border-b border-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-9">
        <div className="flex items-center gap-2 font-display text-lg tracking-wider text-steam-bright">
          <span
            className={`w-2.5 h-2.5 rounded-sm ${
              profile.availableForWork
                ? "bg-steam-green shadow-[0_0_8px_#a4d007]"
                : "bg-steam-dim"
            }`}
          />
          {brand}
        </div>
        <div className="hidden md:flex gap-6 font-display text-[13px] tracking-wide">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-steam-dim hover:text-steam-bright transition-colors uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2.5 text-[13px]">
        <span className="hidden sm:inline text-steam-dim">
          {profile.availableForWork ? "Disponible para trabajar" : "No disponible"}
        </span>
        <span
          className={`w-2 h-2 rounded-full ${
            profile.availableForWork ? "bg-steam-green shadow-[0_0_6px_#a4d007]" : "bg-steam-dim"
          }`}
        />
        <div className="w-[30px] h-[30px] border border-steam-line bg-gradient-to-br from-red-500 to-pink-500 overflow-hidden">
          <AssetImage
            assetId={profile.avatarAssetId}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/*
          Acceso del dueño. Se muestra recién cuando `ready`, para que no
          parpadee "Entrar" un instante antes de reconocer la sesión guardada.
        */}
        {ready ? (
          isOwner ? (
            <button
              type="button"
              onClick={() => signOut()}
              title="Cerrar sesión"
              className="ml-1 text-[11px] font-mono text-steam-dim hover:text-steam-link transition-colors"
            >
              salir
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSigningIn(true)}
              title="Acceso del dueño"
              aria-label="Iniciar sesión"
              className="ml-1 text-[13px] text-steam-dim/40 hover:text-steam-link transition-colors"
            >
              &#9679;
            </button>
          )
        ) : null}
      </div>

      {signingIn ? <SignInDialog onClose={() => setSigningIn(false)} /> : null}
    </nav>
  );
}
