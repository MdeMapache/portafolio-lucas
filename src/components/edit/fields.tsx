"use client";

/**
 * Campos de formulario con el look de la UI de Steam. Están acá y no en cada
 * pestaña para que todo el panel de edición se vea igual y se toque en un
 * solo lugar.
 */

const inputBase =
  "w-full bg-steam-bgDeep border border-steam-line px-3 py-2 text-[13px] text-steam-text " +
  "outline-none transition-colors focus:border-steam-link placeholder:text-steam-dim/50";

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
    <label className="block mb-4">
      <span className="block text-[11px] uppercase tracking-wide text-steam-dim mb-1.5">
        {label}
      </span>
      {children}
      {hint ? <span className="block text-[10.5px] text-steam-dim/70 mt-1">{hint}</span> : null}
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
      "border-steam-link text-white bg-gradient-to-b from-[#2a5a7a] to-[#1c3c52] " +
      "hover:from-[#347399] hover:to-[#25516f]",
    ghost: "border-steam-line text-steam-dim hover:text-steam-bright hover:border-steam-link",
    danger: "border-red-900/60 text-red-400 hover:bg-red-950/40 hover:border-red-700",
  }[variant];

  return (
    <button
      {...props}
      className={`px-3.5 py-1.5 text-[12px] font-display uppercase tracking-wide border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${styles} ${props.className ?? ""}`}
    />
  );
}

/** Fila con acciones a la derecha, para listas editables. */
export function EditRow({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-start gap-2 mb-2 p-2.5 bg-steam-bgDeep/60 border border-steam-line/60">
      <div className="flex-1 min-w-0">{children}</div>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Eliminar"
          className="shrink-0 w-6 h-6 flex items-center justify-center text-steam-dim hover:text-red-400 transition-colors"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

/** Slider 0–100 con el valor a la derecha. */
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
    <div className="flex items-center gap-2.5">
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-steam-green"
      />
      <span className="w-10 text-right font-mono text-[11px] text-steam-dim">{value}</span>
    </div>
  );
}
