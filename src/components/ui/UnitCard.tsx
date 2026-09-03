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
 * del texto tapa el tramo de borde que queda por debajo. Por eso la tarjeta usa
 * un fondo casi opaco — con uno translúcido, el borde se vería atravesando las
 * letras.
 */
export default function UnitCard({
  code,
  title,
  accent,
  aside,
  children,
}: {
  /** Identificador corto, tipo `SEC`. Se muestra como `[SEC]`. */
  code: string;
  title: string;
  accent: Accent;
  /** Contenido extra en la esquina inferior derecha. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`group relative border ${accent.border} ${accent.text} ${accent.glow} bg-cyber-void/90 transition-all duration-200 hover:-translate-y-0.5`}
    >
      <span className="scan-sweep" />
      {/* Escuadras dobles, dentro del borde. */}
      <span aria-hidden className="mw-frame absolute inset-0 pointer-events-none" />

      {/* Cabecera montada sobre el borde superior. */}
      <div className="absolute -top-[8px] left-3 right-3 flex items-baseline gap-2 pointer-events-none">
        <span className="flex items-baseline gap-1.5 bg-cyber-void px-1.5">
          <span aria-hidden className="font-mono text-[9px] leading-none">
            ◄
          </span>
          <h3
            data-text={title}
            className="glitch font-display text-[12.5px] uppercase tracking-[0.16em] text-steam-bright leading-none"
          >
            {title}
          </h3>
          <span aria-hidden className="font-mono text-[9px] leading-none">
            ►
          </span>
        </span>

        <span className="ml-auto bg-cyber-void px-1.5 font-mono text-[9px] leading-none">
          [{code}]
        </span>
      </div>

      <div className="px-4 pt-6 pb-4">{children}</div>

      {aside ? (
        <div className="absolute -bottom-[7px] right-4 bg-cyber-void px-1.5 font-mono text-[8.5px] uppercase tracking-widest leading-none">
          {aside}
        </div>
      ) : null}
    </article>
  );
}
