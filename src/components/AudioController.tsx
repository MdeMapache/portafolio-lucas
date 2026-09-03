"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { onDuckAudio } from "@/lib/audioBus";
import { playClick, playHover, setSfxMuted } from "@/lib/sfx";

const ENABLED_KEY = "portafolio:audio";
const VOLUME_KEY = "portafolio:audio:vol";
const CHANNEL_NAME = "portafolio:audio";
const DEFAULT_VOLUME = 0.35;

/** Elementos que disparan sonido al pasar el cursor. */
const INTERACTIVE = "a, button, [data-sfx]";

/**
 * Control de audio: música en bucle + efectos de interfaz.
 *
 * Va fijo arriba a la derecha, por encima del contenido pero por debajo de los
 * diálogos (z-40 contra el z-50 de los modales).
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
  /** Silencio temporal mientras corre un demo; no toca la preferencia guardada. */
  const [ducked, setDucked] = useState(false);

  // Identidad de esta pestaña y canal con las demás. El id se genera dentro de
  // un efecto y no en el render: `Math.random()` en el cuerpo del componente es
  // impuro y rompe el modelo de React.
  const tabIdRef = useRef<string>("");
  const channelRef = useRef<BroadcastChannel | null>(null);

  /** Reproduce y avisa al resto de las pestañas para que se callen. */
  const startPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => {
        setBlocked(false);
        channelRef.current?.postMessage({ type: "playing", id: tabIdRef.current });
      })
      .catch(() => {
        // Autoplay rechazado: no es un error, es la política del navegador.
        setBlocked(true);
      });
  }, []);

  /**
   * Una sola pestaña sonando a la vez.
   *
   * Va declarado ANTES que el efecto de reproducción para que el canal exista
   * cuando ocurra el primer play; los efectos corren en orden de declaración.
   *
   * La Visibility API sola no alcanza: hay navegadores y contenedores que no
   * marcan como ocultas las pestañas de segundo plano, y entonces dos copias
   * del sitio reproducen la pista en posiciones distintas y se superponen.
   */
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;

    tabIdRef.current = Math.random().toString(36).slice(2);

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; id?: string } | null;
      if (data?.type === "playing" && data.id !== tabIdRef.current) {
        audioRef.current?.pause();
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

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

  // Pedidos de silencio temporal (ver lib/audioBus.ts).
  useEffect(() => onDuckAudio(setDucked), []);

  // Encendido y apagado. `ducked` se trata como un apagado temporal: cuando el
  // demo termina, la música vuelve sola sin pisar la preferencia del usuario.
  useEffect(() => {
    const active = enabled && !ducked;
    setSfxMuted(!active);

    const audio = audioRef.current;
    if (!audio) return;

    if (!active) {
      audio.pause();
      return;
    }

    // En una pestaña oculta no arrancamos: lo hará el listener de visibilidad
    // cuando pase a primer plano.
    if (document.hidden) return;

    startPlayback();
  }, [enabled, ducked, startPlayback]);

  // Si el autoplay quedó bloqueado, el primer gesto lo destraba.
  useEffect(() => {
    if (!blocked || !enabled) return;

    function unlock() {
      startPlayback();
    }

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [blocked, enabled, startPlayback]);

  // Sólo suena la pestaña que se está mirando. Complementa al canal de arriba:
  // esto cubre la pestaña olvidada en segundo plano que seguiría haciendo ruido.
  useEffect(() => {
    function onVisibilityChange() {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        audio.pause();
      } else if (enabled && !ducked) {
        // Al volver al frente, esta pestaña reclama el audio para sí.
        startPlayback();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [enabled, ducked, startPlayback]);

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

  const playing = enabled && !blocked && !ducked;
  const percent = Math.round(volume * 100);

  return (
    <>
      {/*
        `loop` en el elemento y no en JS: el navegador reinicia sin corte.

        `preload="none"` y no "auto": con "auto" el navegador se bajaba los
        2,4 MB de la pista apenas cargaba la página, aunque nadie fuera a
        escucharla. Y casi nadie la escucha, porque el autoplay está bloqueado
        hasta que hay un gesto del usuario (ver el estado `blocked`). Como la
        reproducción siempre llega después de un clic, `play()` empieza a
        bufferear en ese momento y la demora es imperceptible.
      */}
      <audio ref={audioRef} src="/audio/theme.mp3" loop preload="none" />

      <div className="fixed top-3 right-3 z-40 flex items-center gap-2.5 px-2.5 py-1.5 border border-mw-phosphor/30 bg-mw-void/85 backdrop-blur-md">
        {/* Silenciar ---------------------------------------------------- */}
        <button
          type="button"
          onClick={toggle}
          aria-pressed={enabled}
          title={enabled ? "Silenciar" : "Activar audio"}
          className={`flex items-end gap-[2px] h-3.5 transition-colors ${
            enabled ? "text-mw-hazard" : "text-steam-dim hover:text-mw-phosphor"
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
          className="w-20 sm:w-24 h-1 accent-mw-phosphor cursor-pointer"
        />

        <span
          className={`font-mono text-[9px] w-7 text-right tabular-nums ${
            ducked ? "text-mw-rust" : "text-steam-dim"
          }`}
          title={ducked ? "Silenciada mientras corre un demo" : undefined}
        >
          {ducked ? "dmo" : blocked ? "···" : String(percent).padStart(3, "0")}
        </span>
      </div>
    </>
  );
}
