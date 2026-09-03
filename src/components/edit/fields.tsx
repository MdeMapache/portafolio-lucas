"use client";

/**
 * Controles del panel de configuración, con el mismo lenguaje de chapa que el
 * resto del sitio: esquinas recortadas, relieve, rótulos en placa ámbar y foco
 * que enciende el borde.
 *
 * Están todos acá y no repartidos por pestaña para que el panel se vea igual
 * en todas y se toque en un solo lugar.
 */

const inputBase =
  "hud-clip-sm w-full bg-mw-fieldDeep border border-mw-steel/40 shadow-plate px-3 py-2 " +
  "font-mono text-[12.5px] text-steam-text outline-none transition-all " +
  "focus:border-mw-hazard focus:shadow-glow-hazard placeholder:text-steam-dim/40";

/** Campo con rótulo en placa y ayuda debajo. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-5">
      <span className="flex items-center gap-2 mb-2">
        <span aria-hidden className="font-mono text-[8.5px] text-mw-steel/70">
          {"//"}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-mw-hazard">
          {label}
        </span>
        {/* Regla técnica: llena el ancho sobrante sin ser una línea lisa. */}
        <span
          aria-hidden
          className="flex-1 h-2 min-w-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(95,140,168,.35) 0 1px, transparent 1px 8px)",
            backgroundPosition: "0 bottom",
            backgroundSize: "100% 5px",
            backgroundRepeat: "repeat-x",
          }}
        />
      </span>

      {children}

      {hint ? (
        <span className="block font-mono text-[9.5px] text-steam-dim/70 mt-1.5 leading-relaxed">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} resize-y ${props.className ?? ""}`} />;
}

export function Button({
  variant = "ghost",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const styles = {
    primary:
      "border-mw-hazard/60 bg-mw-hazard/12 text-mw-hazard hover:bg-mw-hazard/25 hover:shadow-glow-hazard",
    ghost:
      "border-mw-steel/40 bg-steam-panel2/50 text-steam-dim hover:border-mw-steel hover:text-mw-steelLight",
    danger: "border-mw-rust/50 bg-mw-rust/10 text-mw-rust hover:bg-mw-rust/22 hover:shadow-glow-rust",
  }[variant];

  return (
    <button
      {...props}
      className={`hud-clip-sm shadow-plate px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] border transition-all hover:-translate-y-px disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${styles} ${props.className ?? ""}`}
    />
  );
}

/** Fila de una lista editable, con escuadras y botón de baja. */
export function EditRow({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="group relative mw-frame text-mw-steel/50 flex items-start gap-2 mb-2.5 p-3 bg-mw-fieldDeep/70 border border-mw-steel/25 shadow-plate transition-colors hover:border-mw-steel/50">
      <div className="flex-1 min-w-0">{children}</div>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Eliminar"
          className="shrink-0 w-6 h-6 flex items-center justify-center border border-transparent text-steam-dim hover:text-mw-rust hover:border-mw-rust/50 transition-colors"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

/** Deslizador con pastilla ámbar y lectura numérica. */
export function LevelSlider({
  value,
  onChange,
  max = 100,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mech-range flex-1"
      />
      <span className="hud-clip-sm shrink-0 w-12 text-center py-0.5 bg-mw-fieldDeep border border-mw-steel/35 font-mono text-[10px] text-mw-hazard tabular-nums">
        {String(value).padStart(max > 5 ? 3 : 1, "0")}
      </span>
    </div>
  );
}
