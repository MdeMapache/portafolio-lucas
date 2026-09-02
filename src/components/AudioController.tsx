"use client";

import { useEffect, useRef, useState } from "react";
import { playClick, playHover, setSfxMuted } from "@/lib/sfx";

const STORAGE_KEY = "portafolio:audio";
const MUSIC_VOLUME = 0.35;

/** Elementos que disparan sonido al pasar el cursor. */
const INTERACTIVE = "a, button, [data-sfx]";

/**
 * Música de fondo en bucle + efectos de interfaz.
 *
 * Sobre el autoplay: los navegadores no dejan reproducir audio hasta que hay
 * un gesto del usuario, así que no se puede "arrancar sonando" sin más. La
 * estrategia es intentar reproducir al montar y, si el navegador lo rechaza,
 * quedar a la espera del primer clic o tecla para arrancar entonces.
 *
 * Los efectos de hover se enganchan con un listener delegado en `document` en
 * vez de tocar cada botón: así ningún componente tiene que saber que existe
 * el audio.
 */
export default function AudioController() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [enabled, setEnabled] = useState(true);
  const [blocked, setBlocked] = useState(false);

  // Preferencia guardada. Va en rAF y no directo en el efecto para no disparar
  // un setState síncrono (renders en cascada), y arranca en el mismo valor que
  // el servidor para que no haya desajuste de hidratación.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved !== null) setEnabled(saved === "on");
      } catch {
        // Navegador con el almacenamiento bloqueado: seguimos con el default.
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Sincroniza el estado con el elemento de audio y con los efectos.
  useEffect(() => {
    setSfxMuted(!enabled);

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = MUSIC_VOLUME;

    if (!enabled) {
      audio.pause();
      return;
    }

    audio
      .play()
      .then(() => setBlocked(false))
      .catch(() => {
        // Autoplay rechazado: no es un error, es la política del navegador.
        setBlocked(true);
      });
  }, [enabled]);

  // Si el autoplay quedó bloqueado, el primer gesto lo destraba.
  useEffect(() => {
    if (!blocked || !enabled) return;

    function unlock() {
      audioRef.current
        ?.play()
        .then(() => setBlocked(false))
        .catch(() => {});
    }

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [blocked, enabled]);

  // Efectos de interfaz, delegados en document.
  useEffect(() => {
    if (!enabled) return;

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.(INTERACTIVE)) playHover();
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.(INTERACTIVE)) playClick();
    }

    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("click", onClick, { passive: true });

    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, [enabled]);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {
      // Sin almacenamiento la preferencia dura lo que dure la pestaña.
    }
  }

  return (
    <>
      {/* `loop` en el elemento y no en JS: el navegador reinicia sin corte. */}
      <audio ref={audioRef} src="/audio/theme.mp3" loop preload="auto" />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        title={enabled ? "Silenciar audio" : "Activar audio"}
        className={`group flex items-center gap-2 px-2.5 py-1.5 border font-mono text-[9.5px] uppercase tracking-widest transition-all ${
          enabled
            ? "border-cyber-lime/50 text-cyber-lime hover:shadow-neon-lime"
            : "border-steam-dim/30 text-steam-dim hover:border-cyber-cyan hover:text-cyber-cyan"
        }`}
      >
        {/* Barras de ecualizador: animan sólo cuando realmente suena. */}
        <span className="flex items-end gap-[2px] h-3" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-[2px] bg-current ${enabled && !blocked ? "animate-pulse" : ""}`}
              style={{
                height: enabled && !blocked ? `${[10, 6, 12][i]}px` : "3px",
                animationDelay: `${i * 140}ms`,
                transition: "height .2s ease",
              }}
            />
          ))}
        </span>
        {enabled ? (blocked ? "tocá para oír" : "audio on") : "audio off"}
      </button>
    </>
  );
}
