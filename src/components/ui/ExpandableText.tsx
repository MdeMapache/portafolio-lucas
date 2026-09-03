"use client";

import { useState } from "react";

/** Clases de recorte por cantidad de líneas. Tailwind necesita verlas escritas. */
const CLAMP: Record<number, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
};

/**
 * Texto plegado a unas pocas líneas, con interruptor para verlo completo.
 *
 * Existe porque el contenido tenía bloques de 45 a 73 palabras seguidas, y un
 * muro de prosa rompe la lectura de panel: en un instrumental se muestra el
 * dato y el detalle se despliega si hace falta.
 *
 * La decisión de plegar se toma por cantidad de palabras y no midiendo el alto
 * real del elemento. Medir obligaría a leer `scrollHeight` después del layout y
 * guardarlo en estado, con el riesgo de un salto visible en el primer render;
 * el umbral por palabras se resuelve antes de pintar y da el mismo resultado.
 */
export default function ExpandableText({
  children,
  lines = 3,
  /** Desde cuántas palabras conviene plegar. */
  threshold = 28,
  className = "",
}: {
  children: string;
  lines?: 2 | 3 | 4;
  threshold?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const words = children.trim().split(/\s+/).length;
  const needsClamp = words > threshold;

  return (
    <div>
      <p className={`${className} ${needsClamp && !open ? CLAMP[lines] : ""}`}>{children}</p>

      {needsClamp ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-steam-dim hover:text-mw-hazard transition-colors"
        >
          {open ? "[ − ] plegar" : "[ + ] leer completo"}
        </button>
      ) : null}
    </div>
  );
}
