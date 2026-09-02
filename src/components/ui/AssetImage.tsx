"use client";

import { useAssetUrl } from "@/components/PortfolioProvider";
import type { AssetId } from "@/lib/portfolio/types";

/**
 * Muestra un binario guardado en el AssetStore.
 *
 * Usa `<img>` y no `next/image` a propósito: las fuentes son object URL
 * (`blob:`) generadas en el navegador, que el optimizador de imágenes de Next
 * no puede procesar. Además, `next/image` recomprime los GIF y les mata la
 * animación, que es justo lo que queremos conservar en los fondos.
 */
export default function AssetImage({
  assetId,
  alt,
  className = "",
  style,
  fallback = null,
}: {
  assetId: AssetId | null | undefined;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}) {
  const url = useAssetUrl(assetId);

  if (!url) return <>{fallback}</>;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} className={className} style={style} />;
}
