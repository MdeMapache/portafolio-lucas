"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Barra de progreso que anima de 0 al valor real la primera vez que entra en
 * pantalla. Usa IntersectionObserver para que las barras de más abajo no se
 * hayan "gastado" la animación antes de que el usuario llegue a verlas.
 */
export default function ProgressBar({
  value,
  className = "",
  trackClassName = "",
}: {
  /** Porcentaje 0–100. */
  value: number;
  className?: string;
  trackClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Arranca en false tanto en servidor como en cliente: así el HTML coincide y
  // la barra siempre tiene de dónde animar.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sin IntersectionObserver mostramos igual, en el frame siguiente, para no
    // llamar a setState de forma síncrona dentro del efecto.
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
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pct = Math.max(0, Math.min(100, value));

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-[5px] rounded-full bg-steam-panel2 overflow-hidden ${trackClassName}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none ${className}`}
        style={{ width: shown ? `${pct}%` : "0%" }}
      />
    </div>
  );
}
