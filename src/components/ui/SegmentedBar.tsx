"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Barra de avance por bloques.
 *
 * Reemplaza a la barra lisa. Una barra continua es un elemento de interfaz web
 * genérica; una dividida en celdas se lee como un indicador de panel, y además
 * comunica mejor: se puede contar de un vistazo cuánto falta.
 *
 * Los bloques se encienden de izquierda a derecha cuando la barra entra en
 * pantalla, con un retardo por celda. La animación va en `transition-delay` y
 * no en un keyframe para que cada barra arranque cuando le toca y no todas a
 * la vez.
 */
export default function SegmentedBar({
  value,
  segments = 20,
  className = "",
}: {
  /** Porcentaje 0–100. */
  value: number;
  segments?: number;
  /** Clases del bloque encendido; normalmente `bg-*` y `text-*`. */
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pct = Math.max(0, Math.min(100, value));
  const filled = Math.round((pct / 100) * segments);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`flex gap-[2px] h-2.5 ${className}`}
    >
      {Array.from({ length: segments }, (_, i) => {
        const on = i < filled;
        return (
          <span
            key={i}
            className={`flex-1 transition-opacity duration-200 ${
              on ? "bg-current" : "bg-steam-line/25"
            }`}
            style={{
              opacity: on && !shown ? 0.12 : 1,
              transitionDelay: on ? `${i * 26}ms` : "0ms",
            }}
          />
        );
      })}
    </div>
  );
}
