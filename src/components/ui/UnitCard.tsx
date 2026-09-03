"use client";

import UnitCanvas, { type CanvasMode } from "./UnitCanvas";
import type { Accent } from "./accents";

/**
 * Tarjeta con el marco de las pantallas de selección de Metal Warriors.
 *
 * Lo característico de esa referencia no es el color sino la estructura: el
 * título va **montado sobre el borde superior** entre corchetes `◄ ►`, el
 * código identificador se apoya en la misma línea a la derecha, y las esquinas
 * llevan escuadras dobles.
 *
 * El truco del título es el de un `<legend>` de fieldset: un fondo opaco detrás
 * del texto tapa el tramo de borde que queda por debajo. Por eso la cabecera y
 * el pie llevan fondo sólido aunque la tarjeta sea translúcida.
 *
 * Detrás del contenido corre un motivo animado en canvas (radar, rejilla de
 * hangar, telemetría o lluvia de datos). Va a baja opacidad y sube al pasar el
 * cursor: tiene que leerse como instrumental de cabina, no competir con el
 * texto que está encima.
 */
export default function UnitCard({
  code,
  title,
  accent,
  aside,
  canvas,
  size = "sm",
  className = "",
  children,
}: {
  /** Identificador corto, tipo `SEC`. Se muestra como `[SEC]`. */
  code: string;
  title: string;
  accent: Accent;
  /** Contenido extra montado en el borde inferior derecho. */
  aside?: React.ReactNode;
  /** Motivo del fondo animado. Sin esto, la tarjeta va sin canvas. */
  canvas?: CanvasMode;
  /** `lg` para la unidad destacada; el marco es el mismo, cambia la escala. */
  size?: "sm" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  const large = size === "lg";

  return (
    <article
      className={`group relative border ${large ? "border-2" : ""} ${accent.border} ${accent.text} ${accent.glow} bg-mw-void/90 transition-all duration-200 hover:-translate-y-0.5 ${className}`}
    >
      {/*
        El recorte va acá y NO en la tarjeta: el título y el estado van montados
        fuera del borde, así que un `overflow-hidden` en el artículo los cortaría.
      */}
      <span aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Instrumental de fondo. */}
        {canvas ? <UnitCanvas mode={canvas} color={accent.hex} /> : null}

        {/* Viñeta: oscurece los bordes para que el canvas no compita con el
            texto justo donde empiezan los renglones. */}
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(1,6,3,.82)_100%)]" />
      </span>

      <span className="scan-sweep" />
      {/* Escuadras dobles, dentro del borde. */}
      <span aria-hidden className="mw-frame absolute inset-0 pointer-events-none" />

      {/* Tira de peligro en el canto izquierdo: marca la unidad como pieza de
          hangar y da un anclaje de color al costado del bloque de texto. */}
      <span
        aria-hidden
        className="hazard-stripe-dim absolute left-0 top-0 bottom-0 w-[3px] opacity-45 group-hover:opacity-90 transition-opacity"
      />

      {/* Cabecera montada sobre el borde superior. */}
      <div className="absolute -top-[8px] left-3 right-3 z-10 flex items-baseline gap-2 pointer-events-none">
        <span className="flex items-baseline gap-1.5 bg-mw-void px-1.5">
          <span
            aria-hidden
            className="font-mono text-[9px] leading-none transition-transform group-hover:-translate-x-0.5"
          >
            ◄
          </span>
          {/* h4 y no h3: cuelga del divisor de bloque, que ya es h3, que a
              su vez cuelga del h2 del panel de sección. */}
          <h4
            data-text={title}
            className={`glitch font-display uppercase tracking-[0.16em] text-steam-bright leading-none ${
              large ? "text-[15px]" : "text-[12.5px]"
            }`}
          >
            {title}
          </h4>
          <span
            aria-hidden
            className="font-mono text-[9px] leading-none transition-transform group-hover:translate-x-0.5"
          >
            ►
          </span>
        </span>

        <span className="ml-auto bg-mw-void px-1.5 font-mono text-[9px] leading-none">
          [{code}]
        </span>
      </div>

      <div className={`relative z-[1] ${large ? "px-5 pt-7 pb-5" : "px-4 pt-6 pb-4"}`}>
        {children}
      </div>

      {aside ? (
        <div className="absolute -bottom-[7px] right-4 z-10 bg-mw-void px-1.5 font-mono text-[8.5px] uppercase tracking-widest leading-none">
          {aside}
        </div>
      ) : null}
    </article>
  );
}
