"use client";

/**
 * Chapa de cabina: el marco de una sección entera.
 *
 * Reemplaza al rectángulo con borde fino que había antes. Lo que le da cuerpo
 * no es un solo efecto sino la suma de piezas, como en un panel real:
 *
 *  - esquinas cortadas en diagonal, no rectas
 *  - pestaña de cabecera biselada, con el número de sección en su propia placa
 *  - remaches en las cuatro esquinas
 *  - indicador de segmentos que se encienden en cascada
 *  - tira de estado al pie, con franja de peligro
 *
 * El borde se consigue apilando dos capas recortadas —una pinta el borde, la de
 * adelante el relleno un píxel más adentro— porque `border` no sobrevive a un
 * `clip-path`: se recorta junto con el resto.
 */
export default function HudPanel({
  code,
  title,
  hint,
  children,
}: {
  /** Número de sección, en su placa propia. */
  code: string;
  title: string;
  /** Texto técnico de la derecha. */
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* Capa de borde. */}
      <div className="hud-clip absolute inset-0 bg-mw-steel/50" />

      {/* Capa de relleno, un píxel adentro. */}
      <div className="hud-clip absolute inset-[1.5px] bg-mw-void/90 backdrop-blur-xl" />

      {/* Remaches. `top-3 left-3` los pone sobre el corte diagonal, que es
          donde irían los tornillos de una chapa real. */}
      {[
        "top-3 left-3",
        "top-3 right-3",
        "bottom-3 left-3",
        "bottom-3 right-3",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`hud-rivet absolute ${pos} w-1.5 h-1.5 bg-mw-steel/70 text-mw-steel/40 z-10`}
        />
      ))}

      <div className="relative">
        {/* Cabecera --------------------------------------------------------- */}
        <header className="flex items-stretch">
          {/* Placa del número. */}
          <span className="hud-tab flex items-center bg-mw-steel/90 pl-5 pr-6 py-1.5">
            <span className="font-mono text-[11px] font-bold text-mw-void tracking-widest">
              {code}
            </span>
          </span>

          <span className="flex items-center gap-3 flex-1 min-w-0 pl-3 pr-5 py-1.5 border-b border-mw-steel/30">
            <h2
              data-text={title}
              className="glitch font-display text-lg uppercase tracking-[0.22em] text-steam-bright truncate"
            >
              {title}
            </h2>

            {/* Indicador de segmentos: puro adorno de instrumental, pero es lo
                que hace que la cabecera se lea como un panel y no como un h2. */}
            <span aria-hidden className="hidden sm:flex items-center gap-[3px] shrink-0">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="hud-segment w-[3px] h-3 bg-mw-phosphor"
                  style={{ animationDelay: `${i * 180}ms` }}
                />
              ))}
            </span>

            {hint ? (
              <span className="ml-auto shrink-0 font-mono text-[9.5px] uppercase tracking-widest text-steam-dim/60 hidden sm:inline">
                {hint}
              </span>
            ) : null}
          </span>
        </header>

        {/* Cuerpo ----------------------------------------------------------- */}
        <div className="px-4 sm:px-7 py-6">{children}</div>

        {/* Tira de estado --------------------------------------------------- */}
        <footer className="flex items-center gap-3 px-4 sm:px-7 py-1.5 border-t border-mw-steel/25">
          <span aria-hidden className="hazard-stripe-dim h-[7px] flex-1 opacity-60" />
          {/* Sin `shrink-0`: con la escala de texto al máximo esta leyenda no
              entra en un teléfono, y al no poder encogerse empujaba el ancho de
              todo el documento. Ahora envuelve en dos líneas. */}
          <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-steam-dim text-right">
            sistema operativo · enlace estable
          </span>
          <span aria-hidden className="hazard-stripe-dim h-[7px] w-12 opacity-60" />
        </footer>
      </div>
    </div>
  );
}
