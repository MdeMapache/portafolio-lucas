"use client";

import { useEffect, useState } from "react";

/**
 * Control de tamaño de texto.
 *
 * Mueve la variable `--ts` del elemento raíz, que multiplica todos los tamaños
 * de fuente del sitio — ver el bloque "Escala de texto" en globals.css.
 *
 * Por qué existe: el sitio está escrito con tamaños en píxeles literales, y
 * varios de ellos son de 9 o 10px. Eso es chico para mucha gente, y como son
 * píxeles, la configuración de tamaño de fuente del navegador no los toca. Sin
 * este control no había forma de agrandarlos salvo el zoom, que además agranda
 * el fondo y rompe la composición.
 *
 * Sólo escala el texto, no el espaciado: agrandar todo sería el zoom del
 * navegador, que ya existe. Acá lo que se busca es que la letra crezca dentro
 * de la misma maqueta.
 */

export const TEXT_SCALE_KEY = "portafolio:text-scale";

/**
 * Valor de fábrica. Es a lo que vuelve el botón de "tamaño normal" y el estado
 * inicial del control antes de leer el valor real del DOM.
 *
 * Tiene que coincidir con el `--ts` del `:root` en globals.css, que es lo que
 * define el tamaño que ve realmente quien entra por primera vez. Si se
 * desincronizan, el sitio se ve a un tamaño y el control muestra otro.
 */
export const DEFAULT_SCALE = 1.1;

const MIN_SCALE = 0.9;
const MAX_SCALE = 1.5;
const STEP = 0.05;

/** Deja el valor dentro del rango y lo redondea al paso, para evitar 1.0500000001. */
export function normalizeScale(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_SCALE;
  const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
  return Math.round(clamped / STEP) * STEP;
}

/**
 * Script que corre antes de pintar, para que quien tenga una escala guardada no
 * vea el texto saltar de tamaño al hidratar.
 *
 * Va como string y no como función para poder inyectarlo en el HTML inicial.
 * Todo entre try/catch: en un navegador con el almacenamiento bloqueado esto no
 * puede tirar abajo la página.
 */
export const TEXT_SCALE_INIT_SCRIPT = `
try {
  var v = parseFloat(localStorage.getItem(${JSON.stringify(TEXT_SCALE_KEY)}));
  if (v >= ${MIN_SCALE} && v <= ${MAX_SCALE}) {
    document.documentElement.style.setProperty('--ts', String(v));
  }
} catch (e) {}
`.trim();

export default function TextScaleController() {
  const [scale, setScale] = useState(DEFAULT_SCALE);

  /*
    El estado arranca en el valor de fábrica para que el marcado del servidor y
    el del cliente coincidan; el valor real se lee después de montar. Se lee del
    DOM y no de localStorage porque el script de arriba ya lo aplicó, y así hay
    una sola fuente de verdad.

    Va dentro de un rAF, igual que en AudioController: un setState síncrono en
    el cuerpo de un efecto encadena renders y React lo desaconseja.
  */
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const actual = getComputedStyle(document.documentElement).getPropertyValue("--ts");
      const parsed = parseFloat(actual);
      if (Number.isFinite(parsed)) setScale(normalizeScale(parsed));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function change(next: number) {
    const value = normalizeScale(next);
    setScale(value);
    document.documentElement.style.setProperty("--ts", String(value));

    try {
      window.localStorage.setItem(TEXT_SCALE_KEY, String(value));
    } catch {
      // Sin almacenamiento la preferencia dura lo que dure la pestaña.
    }
  }

  const percent = Math.round(scale * 100);

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 border border-mw-phosphor/30 bg-mw-void/85 backdrop-blur-md">
      {/* Las dos "A" son la pista visual de para qué sirve la barra; se apoyan
          en tamaños fijos en rem para no escalarse a sí mismas. */}
      <span aria-hidden className="font-display leading-none text-mw-phosphor/60 text-[0.6rem]">
        A
      </span>

      <input
        type="range"
        min={MIN_SCALE}
        max={MAX_SCALE}
        step={STEP}
        value={scale}
        onChange={(e) => change(Number(e.target.value))}
        aria-label="Tamaño del texto"
        aria-valuetext={`${percent} por ciento`}
        title="Tamaño del texto"
        className="w-16 sm:w-20 h-1 accent-mw-phosphor cursor-pointer"
      />

      <span aria-hidden className="font-display leading-none text-mw-phosphor text-[0.95rem]">
        A
      </span>

      <button
        type="button"
        onClick={() => change(DEFAULT_SCALE)}
        disabled={scale === DEFAULT_SCALE}
        title="Volver al tamaño normal"
        className="font-mono text-[0.55rem] w-8 text-right tabular-nums text-steam-dim
                   enabled:hover:text-mw-phosphor transition-colors disabled:cursor-default"
      >
        {percent}%
      </button>
    </div>
  );
}
