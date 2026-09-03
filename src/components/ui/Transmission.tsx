"use client";

/**
 * Bloque de texto tratado como una transmisión entrante.
 *
 * Existe porque un párrafo suelto es lo más genérico que puede haber en una
 * pantalla: no importa cuánto se decore alrededor, un bloque de texto sin
 * marco se lee como una página web cualquiera.
 *
 * El tratamiento es de terminal: rótulo de origen arriba, raíl a la izquierda,
 * fondo de campo verde y un cursor parpadeando al final, como si el mensaje
 * acabara de terminar de imprimirse.
 */
export default function Transmission({
  label = "transmisión",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mb-7">
      {/* Rótulo de origen, montado sobre el borde superior. */}
      <div className="flex items-center gap-2 mb-1.5">
        <span aria-hidden className="font-mono text-[9px] text-mw-phosphor">
          {">>"}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-mw-phosphor/70">
          {label}
        </span>
        <span aria-hidden className="flex-1 h-px bg-gradient-to-r from-mw-phosphor/35 to-transparent" />
      </div>

      <div className="hud-clip-sm relative bg-mw-field/25 border-l-2 border-mw-phosphor/50 pl-4 pr-4 py-3.5">
        {/* Marcas de cinta sobre el raíl izquierdo: detalle de instrumental que
            rompe la verticalidad limpia del borde. */}
        <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[2px] flex flex-col justify-around">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="block w-[6px] h-px bg-mw-phosphor/60" />
          ))}
        </span>

        <p className="text-[13px] leading-relaxed text-steam-text/90">
          {children}
          <span aria-hidden className="hud-caret ml-1 inline-block w-[7px] h-[13px] align-[-2px] bg-mw-phosphor" />
        </p>
      </div>
    </div>
  );
}
