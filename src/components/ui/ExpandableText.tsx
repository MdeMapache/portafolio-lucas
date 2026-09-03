"use client";

import { useEffect, useRef, useState } from "react";

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
 * muro de prosa rompe la lectura de panel.
 *
 * El interruptor sólo aparece si el texto REALMENTE se está cortando, y eso se
 * mide sobre el elemento ya renderizado. Antes se decidía contando palabras, y
 * el resultado era un botón que no hacía nada: un párrafo de 45 palabras entra
 * en tres líneas si la tarjeta es ancha, así que el recorte no cortaba nada
 * pero el botón se mostraba igual.
 *
 * No hay salto visible al medir porque el texto arranca plegado: lo único que
 * puede pasar después del primer cuadro es que el botón desaparezca, que es
 * mucho menos molesto que ver el texto completo y que se encoja.
 */
export default function ExpandableText({
  children,
  lines = 3,
  className = "",
}: {
  children: string;
  lines?: 2 | 3 | 4;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    // Con el texto desplegado no hay nada que medir: el recorte está quitado y
    // daría "no sobra", escondiendo el botón y dejando al lector encerrado en
    // el estado abierto.
    if (!el || open) return;

    function medir() {
      const node = ref.current;
      if (!node) return;
      // El margen de 1 px cubre los redondeos de alto de línea.
      setOverflows(node.scrollHeight > node.clientHeight + 1);
    }

    // En el cuadro siguiente, ya con el layout resuelto.
    const frame = requestAnimationFrame(medir);

    // Que sobre texto o no depende del ancho, así que hay que re-medir cuando
    // el contenedor cambia de tamaño.
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => medir()) : null;
    observer?.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [children, lines, open]);

  return (
    <div>
      <p ref={ref} className={`${className} ${open ? "" : CLAMP[lines]}`}>
        {children}
      </p>

      {overflows ? (
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
