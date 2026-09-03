/**
 * Cabecera de sección interna, al estilo del dossier del perfil.
 *
 * Deliberadamente liviana: estos paneles ya viven dentro del panel holográfico
 * del SectionRouter, así que repetir marco, fondo y borde generaría una caja
 * dentro de otra caja. Acá alcanza con el rótulo `// título` y el contenido.
 */
export default function Panel({
  title,
  aside,
  id,
  className = "",
  bodyClassName = "",
  children,
}: {
  title: string;
  /** Contenido a la derecha del título: un contador, un botón de editar, etc. */
  aside?: React.ReactNode;
  id?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`mb-7 ${className}`}>
      <header className="flex items-baseline gap-2 mb-3 pb-1.5 border-b border-mw-steel/20">
        <span className="font-mono text-[10px] text-mw-steel/70">{"//"}</span>
        {/* h3: es un bloque DENTRO de una sección, cuyo título ya es el h2
            del panel de cabina. Con h2 acá la jerarquía quedaba plana y las
            tarjetas (h4) saltaban un nivel. */}
        <h3
          data-text={title}
          className="glitch font-mono text-[10px] uppercase tracking-[0.25em] text-mw-hazard"
        >
          {title}
        </h3>
        {aside ? (
          <div className="ml-auto flex items-center gap-3 font-mono text-[10px]">{aside}</div>
        ) : null}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
