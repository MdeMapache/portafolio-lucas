/**
 * Divisor de bloque dentro de una sección.
 *
 * Sustituye al `// título` en texto chico, que se perdía entre el contenido.
 * Suma tres cosas que lo convierten en una pieza de instrumental: una placa
 * con el rótulo, marcas de escala a lo largo de la línea y un contador
 * opcional a la derecha.
 */
export default function BlockDivider({
  label,
  count,
  id,
  className = "",
}: {
  label: string;
  /** Número a la derecha, ya formateado. */
  count?: string;
  /** Para que un `aria-labelledby` pueda apuntar al rótulo. */
  id?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 mb-4 ${className}`}>
      <span aria-hidden className="font-mono text-[9px] text-mw-phosphor/60 shrink-0">
        {"//"}
      </span>

      {/* El rótulo es un heading de verdad, no un span decorado: encabeza un
          bloque de contenido y así queda en el árbol de accesibilidad. */}
      <h3
        id={id}
        className="hud-clip-sm bg-mw-phosphor/15 border border-mw-phosphor/35 px-2.5 py-1 shrink-0 font-mono text-[9.5px] uppercase tracking-[0.25em] text-mw-phosphor"
      >
        {label}
      </h3>

      {/* Marcas de escala: una regla técnica en vez de una línea lisa. */}
      <span
        aria-hidden
        className="flex-1 h-3 min-w-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(70,255,110,.35) 0 1px, transparent 1px 9px)",
          backgroundPosition: "0 bottom",
          backgroundSize: "100% 6px",
          backgroundRepeat: "repeat-x",
        }}
      />

      {count ? (
        <span className="font-mono text-[9.5px] text-mw-phosphor/70 shrink-0 tabular-nums">
          {count}
        </span>
      ) : null}
    </div>
  );
}
