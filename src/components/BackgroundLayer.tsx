"use client";

import { usePortfolio, useAssetUrl } from "@/components/PortfolioProvider";
import { findPreset } from "@/lib/portfolio/backgrounds";

/**
 * Capa de fondo del perfil, fija detrás de todo el contenido.
 *
 * Apila cuatro planos, de abajo hacia arriba:
 *   1. el fondo elegido (preset CSS animado, o GIF/imagen propia)
 *   2. un velo oscuro que mantiene legible el texto encima
 *   3. la grilla técnica
 *   4. las scanlines CRT y el barrido de tubo
 *
 * Va montada una sola vez en el layout, así el fondo no parpadea al cambiar
 * de sección.
 */
export default function BackgroundLayer() {
  const { data } = usePortfolio();
  const { background } = data;

  const customAssetId = background.kind === "custom" ? background.assetId : null;
  const customUrl = useAssetUrl(customAssetId);

  // Mientras carga el GIF mostramos el preset por defecto, para no dejar un
  // hueco negro en el primer render.
  const showCustom = background.kind === "custom" && customUrl;
  const presetClass =
    background.kind === "preset" ? findPreset(background.presetId).className : "bg-preset-steam";

  return (
    <div aria-hidden className="crt-sweep fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {showCustom ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${customUrl})` }}
        />
      ) : (
        <div className={`absolute inset-0 ${presetClass}`} />
      )}

      {/* Velo: los presets ya están pensados para leerse encima, así que
          reciben menos; un GIF cualquiera necesita más. */}
      <div
        className={`absolute inset-0 ${showCustom ? "bg-mw-void/72" : "bg-mw-void/40"}`}
      />
      <div className="absolute inset-0 bg-grid-overlay" />
      <div className="absolute inset-0 crt-scanlines" />
    </div>
  );
}
