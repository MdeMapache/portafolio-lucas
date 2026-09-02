"use client";

import { usePortfolio, useAssetUrl } from "@/components/PortfolioProvider";
import { findPreset } from "@/lib/portfolio/backgrounds";

/**
 * Capa de fondo del perfil, fija detrás de todo el contenido.
 *
 * Soporta las dos formas que definimos en `BackgroundChoice`:
 *  - `preset`: una clase CSS del catálogo (animada con keyframes).
 *  - `custom`: una imagen o GIF que el usuario subió, servida desde IndexedDB.
 *
 * Se monta una sola vez en el layout, así el fondo no parpadea al navegar.
 */
export default function BackgroundLayer() {
  const { data } = usePortfolio();
  const { background } = data;

  const customAssetId = background.kind === "custom" ? background.assetId : null;
  const customUrl = useAssetUrl(customAssetId);

  // Mientras carga el GIF de IndexedDB mostramos el preset por defecto, para no
  // dejar un hueco negro en el primer render.
  const showCustom = background.kind === "custom" && customUrl;
  const presetClass =
    background.kind === "preset" ? findPreset(background.presetId).className : "bg-preset-steam";

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
      {showCustom ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${customUrl})` }}
        />
      ) : (
        <div className={`absolute inset-0 ${presetClass}`} />
      )}

      {/* Oscurecido para mantener legible el texto. Los presets ya están pensados
          para leerse encima, así que reciben menos; un GIF cualquiera necesita más. */}
      <div className={`absolute inset-0 ${showCustom ? "bg-steam-bgDeep/65" : "bg-steam-bgDeep/30"}`} />
      <div className="absolute inset-0 bg-grid-overlay" />
    </div>
  );
}
