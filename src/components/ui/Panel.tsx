/**
 * Contenedor con la cabecera de sección típica de Steam: título a la izquierda,
 * dato o acción a la derecha, y el cuerpo del panel abajo.
 */
export default function Panel({
  title,
  aside,
  id,
  className = "",
  bodyClassName = "p-5",
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
    <section
      id={id}
      className={`bg-steam-panel border border-white/5 mb-5 transition-colors hover:border-white/10 ${className}`}
    >
      <header className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-steam-line to-steam-bgTop">
        <h2 className="text-steam-bright text-sm tracking-wide">{title}</h2>
        {aside ? <div className="flex items-center gap-3 text-xs">{aside}</div> : null}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
