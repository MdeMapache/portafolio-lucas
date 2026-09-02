"use client";

import { useEffect, useRef, useState } from "react";
import { playClick, playHover, setSfxMuted } from "@/lib/sfx";

const ENABLED_KEY = "portafolio:audio";
const VOLUME_KEY = "portafolio:audio:vol";
const DEFAULT_VOLUME = 0.35;

/** Elementos que disparan sonido al pasar el cursor. */
const INTERACTIVE = "a, button, [data-sfx]";

/**
 * Control de audio: música en bucle + efectos de interfaz.
 *
 * Va fijo arriba a la derecha, por encima del contenido pero por debajo de los
 * diálogos (z-40 contra el z-50 de los modales), para que abrir el panel de
 * edición no deje el control flotando encima.
 *
 * Sobre el autoplay: los navegadores no dejan reproducir hasta que hay un gesto
 * del usuario. Se intenta al montar y, si lo rechazan, queda a la espera del
 * primer clic o tecla.
 *
 * Los efectos de hover se enganchan con un listener delegado en `document`, así
 * ningún componente necesita saber que existe el audio.
 */
export default function AudioController() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [blocked, setBlocked] = useState(false);

  // Preferencias guardadas. Van en rAF y no directo en el efecto para no
  // disparar un setState síncrono, y arrancan en el mismo valor que el servidor
  // para que no haya desajuste de hidratación.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const savedEnabled = window.localStorage.getItem(ENABLED_KEY);
        if (savedEnabled !== null) setEnabled(savedEnabled === "on");

        const savedVolume = Number(window.localStorage.getItem(VOLUME_KEY));
        if (Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1) {
          setVolume(savedVolume);
        }
      } catch {
        // Navegador con el almacenamiento bloqueado: seguimos con los defaults.
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // El volumen se aplica solo, sin tocar reproducción: así arrastrar la barra
  // no reinicia ni corta la pista.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Encendido y apagado.
  useEffect(() => {
    setSfxMuted(!enabled);

    const audio = audioRef.current;
    if (!audio) return;

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

  function persist(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Sin almacenamiento la preferencia dura lo que dure la pestaña.
    }
  }

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    persist(ENABLED_KEY, next ? "on" : "off");
  }

  function changeVolume(next: number) {
    setVolume(next);
    persist(VOLUME_KEY, String(next));
    // Mover la barra desde cero es una forma implícita de encender.
    if (next > 0 && !enabled) {
      setEnabled(true);
      persist(ENABLED_KEY, "on");
    }
  }

  const playing = enabled && !blocked;
  const percent = Math.round(volume * 100);

  return (
    <>
      {/* `loop` en el elemento y no en JS: el navegador reinicia sin corte. */}
      <audio ref={audioRef} src="/audio/theme.mp3" loop preload="auto" />

      <div className="fixed top-3 right-3 z-40 flex items-center gap-2.5 px-2.5 py-1.5 border border-cyber-cyan/30 bg-cyber-void/85 backdrop-blur-md">
        {/* Silenciar ---------------------------------------------------- */}
        <button
          type="button"
          onClick={toggle}
          aria-pressed={enabled}
          title={enabled ? "Silenciar" : "Activar audio"}
          className={`flex items-end gap-[2px] h-3.5 transition-colors ${
            enabled ? "text-cyber-lime" : "text-steam-dim hover:text-cyber-cyan"
          }`}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-[2px] bg-current ${playing ? "animate-pulse" : ""}`}
              style={{
                height: playing ? `${[11, 6, 14][i]}px` : "3px",
                animationDelay: `${i * 140}ms`,
                transition: "height .2s ease",
              }}
            />
          ))}
        </button>

        {/* Volumen ------------------------------------------------------- */}
        <input
          type="range"
          min={0}
          max={100}
          value={percent}
          onChange={(e) => changeVolume(Number(e.target.value) / 100)}
          aria-label="Volumen de la música"
          className="w-20 sm:w-24 h-1 accent-cyber-cyan cursor-pointer"
        />

        <span className="font-mono text-[9px] text-steam-dim w-7 text-right tabular-nums">
          {blocked ? "···" : String(percent).padStart(3, "0")}
        </span>
      </div>
    </>
  );
}
