/**
 * Efectos de interfaz sintetizados con Web Audio.
 *
 * No se cargan archivos: los sonidos se generan con osciladores en el momento.
 * Pesan cero bytes, no suman peticiones de red y se afinan cambiando números en
 * vez de reexportar audio.
 *
 * El AudioContext se crea perezosamente porque los navegadores lo dejan
 * suspendido hasta que hay un gesto del usuario; intentar crearlo al cargar
 * sólo dejaría un contexto muerto.
 */

let ctx: AudioContext | null = null;
let muted = false;
let lastHoverAt = 0;

/** Mínimo entre blips de hover: sin esto, barrer el mouse dispara una ráfaga. */
const HOVER_THROTTLE_MS = 70;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }

  // Si el navegador lo dejó suspendido, este gesto es el momento de reanudarlo.
  if (ctx.state === "suspended") void ctx.resume();

  return ctx;
}

export function setSfxMuted(value: boolean) {
  muted = value;
}

export function isSfxMuted() {
  return muted;
}

/**
 * Blip corto con caída de frecuencia. Es el sonido base: hover y click sólo
 * cambian el tono, el volumen y la duración.
 */
function blip({
  from,
  to,
  duration,
  gain,
  type = "square",
}: {
  from: number;
  to: number;
  duration: number;
  gain: number;
  type?: OscillatorType;
}) {
  const audio = getContext();
  if (!audio || muted) return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const amp = audio.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), now + duration);

  // Ataque casi instantáneo y caída exponencial: sin esto se oye un "clic"
  // de corte al cerrar la ganancia de golpe.
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.006);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(amp).connect(audio.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

/** Al pasar el cursor: agudo, muy corto y bajito. */
export function playHover() {
  const now = performance.now();
  if (now - lastHoverAt < HOVER_THROTTLE_MS) return;
  lastHoverAt = now;

  blip({ from: 1750, to: 1180, duration: 0.055, gain: 0.025, type: "square" });
}

/** Al hacer clic: dos tonos, un poco más presente. */
export function playClick() {
  blip({ from: 880, to: 1560, duration: 0.05, gain: 0.05, type: "square" });
  window.setTimeout(
    () => blip({ from: 1560, to: 620, duration: 0.09, gain: 0.04, type: "sawtooth" }),
    45,
  );
}
