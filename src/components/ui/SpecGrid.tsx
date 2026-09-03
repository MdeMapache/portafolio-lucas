/**
 * Ficha de especificaciones: celdas rotuladas en fila.
 *
 * Existe porque el cuerpo de las tarjetas era una línea de descripción y nada
 * más. Una ficha con datos rotulados —tipo, estado, avance— le da densidad y
 * hace que la tarjeta se lea como la hoja de una unidad y no como un ítem de
 * lista cualquiera.
 *
 * Las celdas se reparten el ancho por igual y llevan separadores entre sí, con
 * el relieve de chapa para que se vean troqueladas sobre la placa.
 */
export default function SpecGrid({
  items,
  className = "",
}: {
  items: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <dl
      className={`grid border-y border-current/20 bg-mw-fieldDeep/60 shadow-plate ${className}`}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`px-2.5 py-1.5 min-w-0 ${
            i < items.length - 1 ? "border-r border-current/15" : ""
          }`}
        >
          <dt className="font-mono text-[8px] uppercase tracking-[0.2em] text-steam-dim/70 mb-0.5">
            {item.label}
          </dt>
          <dd className="font-mono text-[10.5px] text-steam-text truncate">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
