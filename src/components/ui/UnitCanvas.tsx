"use client";

import { useEffect, useRef } from "react";

export type CanvasMode = "radar" | "grid" | "telemetry" | "rain";

/** Los cuatro modos, para repartirlos por posición sin repetir seguido. */
export const CANVAS_MODES: CanvasMode[] = ["radar", "grid", "telemetry", "rain"];

export function canvasModeFor(index: number): CanvasMode {
  return CANVAS_MODES[index % CANVAS_MODES.length];
}

/**
 * Fondo animado de una tarjeta, dibujado en canvas.
 *
 * Cuatro motivos de cabina de mech: barrido de radar, rejilla de hangar en
 * perspectiva, telemetría tipo osciloscopio y lluvia de datos.
 *
 * Tres decisiones que hacen que esto no arruine el rendimiento con una docena
 * de tarjetas en pantalla:
 *
 *  - Sólo dibuja mientras la tarjeta está VISIBLE. Fuera de pantalla, el bucle
 *    se detiene por completo (IntersectionObserver).
 *  - La resolución se limita a 1.5x aunque la pantalla sea 3x: es un fondo
 *    decorativo detrás de texto, nadie va a notar la diferencia y son cuatro
 *    veces menos píxeles que pintar.
 *  - Con `prefers-reduced-motion` dibuja UN cuadro y para.
 *
 * No usa estado de React a propósito: todo vive en refs y en el bucle de
 * animación, así una tarjeta animando no provoca renders.
 */
export default function UnitCanvas({
  mode,
  color,
  className = "",
}: {
  mode: CanvasMode;
  /** Color de trazo en hexadecimal. */
  color: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;
    let visible = false;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /** Barrido de radar: arcos concéntricos y una aguja que gira dejando estela. */
    function drawRadar(t: number) {
      const cx = width * 0.82;
      const cy = height * 0.5;
      const radius = Math.max(width, height) * 0.7;

      ctx!.strokeStyle = color;
      ctx!.globalAlpha = 0.1;
      ctx!.lineWidth = 1;
      for (let r = radius * 0.25; r < radius; r += radius * 0.25) {
        ctx!.beginPath();
        ctx!.arc(cx, cy, r, 0, Math.PI * 2);
        ctx!.stroke();
      }

      const angle = (t / 1400) % (Math.PI * 2);
      const sweep = ctx!.createConicGradient?.(angle - 0.6, cx, cy);
      if (sweep) {
        sweep.addColorStop(0, `${color}00`);
        sweep.addColorStop(0.12, `${color}44`);
        sweep.addColorStop(0.14, `${color}00`);
        ctx!.globalAlpha = 0.55;
        ctx!.fillStyle = sweep;
        ctx!.beginPath();
        ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.globalAlpha = 0.5;
      ctx!.beginPath();
      ctx!.moveTo(cx, cy);
      ctx!.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx!.stroke();
    }

    /** Rejilla de hangar: líneas que se pierden hacia un punto de fuga. */
    function drawGrid(t: number) {
      const horizon = height * 0.32;
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1;

      // Líneas que se acercan, con el espaciado creciendo hacia abajo.
      const scroll = (t / 2600) % 1;
      ctx!.globalAlpha = 0.14;
      for (let i = 0; i < 11; i++) {
        const p = (i + scroll) / 11;
        const y = horizon + (height - horizon) * p * p;
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }

      // Radiales desde el punto de fuga.
      ctx!.globalAlpha = 0.1;
      const vx = width * 0.5;
      for (let i = -7; i <= 7; i++) {
        ctx!.beginPath();
        ctx!.moveTo(vx, horizon);
        ctx!.lineTo(vx + i * width * 0.22, height);
        ctx!.stroke();
      }
    }

    /** Telemetría: onda desplazándose sobre una cuadrícula fina. */
    function drawTelemetry(t: number) {
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1;

      ctx!.globalAlpha = 0.08;
      for (let x = 0; x < width; x += 26) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }

      ctx!.globalAlpha = 0.4;
      ctx!.lineWidth = 1.4;
      ctx!.beginPath();
      const mid = height * 0.62;
      for (let x = 0; x <= width; x += 3) {
        const phase = x / 34 - t / 260;
        // Dos senos de distinta frecuencia más un pico ocasional: una onda
        // limpia se lee como decorado, una irregular se lee como telemetría.
        const spike = Math.sin(phase * 0.21) > 0.94 ? Math.sin(phase * 9) * 14 : 0;
        const y = mid + Math.sin(phase) * 7 + Math.sin(phase * 2.3) * 3.5 + spike;
        if (x === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.stroke();
    }

    /** Lluvia de datos: columnas de trazos cayendo a distinta velocidad. */
    function drawRain(t: number) {
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 2;
      const columns = Math.max(6, Math.floor(width / 26));

      for (let i = 0; i < columns; i++) {
        // Velocidad y desfase derivados del índice: sin aleatoriedad, el
        // patrón es estable entre cuadros y no titila.
        const speed = 0.4 + ((i * 37) % 11) / 11;
        const offset = ((i * 53) % 17) / 17;
        const y = (((t / 1100) * speed + offset) % 1.4) * (height + 40) - 40;
        const x = 13 + i * (width / columns);

        ctx!.globalAlpha = 0.05 + ((i * 29) % 7) / 30;
        ctx!.beginPath();
        ctx!.moveTo(x, y);
        ctx!.lineTo(x, y + 22);
        ctx!.stroke();
      }
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);
      if (mode === "radar") drawRadar(t);
      else if (mode === "grid") drawGrid(t);
      else if (mode === "telemetry") drawTelemetry(t);
      else drawRain(t);
      ctx!.globalAlpha = 1;
    }

    function loop() {
      frame += 16;
      draw(frame);
      raf = requestAnimationFrame(loop);
    }

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!visible || reduced) draw(frame);
    });
    resizeObserver.observe(canvas);

    if (reduced) {
      // Un solo cuadro: el motivo se ve, pero nada se mueve.
      draw(1200);
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          const nowVisible = entries.some((e) => e.isIntersecting);
          if (nowVisible === visible) return;
          visible = nowVisible;

          if (visible) raf = requestAnimationFrame(loop);
          else cancelAnimationFrame(raf);
        },
        { threshold: 0 },
      );
      io.observe(canvas);

      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        resizeObserver.disconnect();
      };
    }

    return () => resizeObserver.disconnect();
  }, [mode, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`absolute inset-0 w-full h-full pointer-events-none opacity-60 transition-opacity duration-300 group-hover:opacity-100 ${className}`}
    />
  );
}
