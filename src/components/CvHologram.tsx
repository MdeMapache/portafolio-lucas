"use client";

import { useEffect, useState } from "react";
import CvProjection from "./CvProjection";

/**
 * Proyector holográfico del CV.
 *
 * Muestra el PDF como si fuera una proyección: el documento se tiñe de cian, se
 * apoya sobre un emisor encendido del que sale un cono de luz, y lo cruzan
 * líneas de barrido y una banda de refresco.
 *
 * El teñido lo hace <CvProjection/> sobre un canvas y no un filtro CSS, para
 * poder dejar las fotos del PDF sin tocar — ver el comentario de ese archivo.
 *
 * Dos modos:
 *  - Vista previa: la primera página, recortada, dentro de un botón que abre el
 *    documento completo. El canvas es decorativo (`aria-hidden` va adentro).
 *  - Expandido: todas las páginas, con scroll y con el interruptor de tinte.
 *
 * Sobre el interruptor: el efecto está bueno, pero un CV se lee para decidir si
 * te contratan. Quien necesite leerlo de verdad tiene que poder apagar el
 * tinte, así que el modo expandido arranca con el holograma puesto y se saca
 * con un clic.
 */

/** Escuadras del visor, en las cuatro esquinas. */
function Brackets({ className = "border-mw-phosphor/70" }: { className?: string }) {
  const corners = [
    "top-1.5 left-1.5 border-t border-l",
    "top-1.5 right-1.5 border-t border-r",
    "bottom-1.5 left-1.5 border-b border-l",
    "bottom-1.5 right-1.5 border-b border-r",
  ];

  return (
    <>
      {corners.map((c) => (
        <span key={c} aria-hidden className={`absolute z-20 w-3.5 h-3.5 ${c} ${className}`} />
      ))}
    </>
  );
}

/** Capas de efecto que van por encima del documento, sin capturar el mouse. */
function Overlays({ beam = true }: { beam?: boolean }) {
  return (
    <>
      {beam ? <span aria-hidden className="holo-beam z-10" /> : null}
      <span aria-hidden className="holo-lines z-10" />
      <span aria-hidden className="holo-band absolute inset-0 z-10 pointer-events-none" />
    </>
  );
}

export default function CvHologram({ url }: { url: string | null }) {
  const [open, setOpen] = useState(false);
  const [tinted, setTinted] = useState(true);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <section aria-labelledby="cv-holo-title">
      <h3
        id="cv-holo-title"
        className="font-mono text-[10px] uppercase tracking-[0.25em] text-mw-phosphor/70 mb-3"
      >
        {"// documento adjunto"}
      </h3>

      {/* Lectura de estado, al estilo de una consola. */}
      <div className="flex items-center gap-2 mb-2 font-mono text-[9.5px] uppercase tracking-widest">
        <span className="text-mw-phosphor">doc://cv.pdf</span>
        <span
          aria-hidden
          className={`w-1.5 h-1.5 rounded-full ${
            url ? "bg-mw-hazard neon-pulse text-mw-hazard" : "bg-steam-dim/50"
          }`}
        />
        <span className={url ? "text-mw-hazard" : "text-steam-dim/60"}>
          {url ? "señal estable" : "sin señal"}
        </span>
      </div>

      {url ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir el CV completo"
          className="group relative block w-full text-left"
        >
          {/*
            La altura es fija y el documento se recorta: es una vista previa, no
            el documento entero. Lo que sobra se ve al ampliar.
          */}
          <div className="relative h-[26rem] overflow-hidden border border-mw-phosphor/40 bg-black">
            <CvProjection url={url} tinted className="w-full" />
            <Overlays />
            <Brackets />

            {/* Degradado inferior: corta el recorte del documento sin una línea
                dura y le da fondo a la llamada a la acción. */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-mw-void via-mw-void/80 to-transparent"
            />
            <span
              className="absolute inset-x-0 bottom-0 z-20 py-2 text-center font-mono text-[9.5px]
                         uppercase tracking-widest text-mw-phosphor border-t border-mw-phosphor/30
                         transition-colors group-hover:text-steam-bright group-hover:bg-mw-phosphor/15"
            >
              ampliar proyección
            </span>
          </div>

          {/* Emisor + su reflejo difuso en la "base". */}
          <span aria-hidden className="block h-px mt-px holo-emitter" />
          <span
            aria-hidden
            className="block h-6 bg-gradient-to-b from-mw-phosphor/12 to-transparent blur-[2px]"
          />
        </button>
      ) : (
        /* Sin PDF cargado el proyector queda encendido pero vacío: comunica que
           la función existe y que falta el documento. */
        <div className="relative h-44 border border-dashed border-mw-phosphor/25 bg-black/60 overflow-hidden">
          <span aria-hidden className="holo-beam opacity-40" />
          <span aria-hidden className="holo-lines opacity-60" />
          <Brackets className="border-mw-phosphor/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center">
            <span className="font-mono text-[11px] text-mw-phosphor/60 animate-pulse">
              SIN DOCUMENTO
            </span>
            <span className="font-mono text-[9.5px] text-steam-dim/60 leading-relaxed">
              Subí el PDF en Modificar perfil → Perfil → Subir PDF
            </span>
          </div>
        </div>
      )}

      {/* Modo expandido --------------------------------------------------- */}
      {open && url ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-8"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Curriculum Vitae"
            onClick={(e) => e.stopPropagation()}
            className="holo-edge relative w-full max-w-3xl h-[90vh] flex flex-col bg-mw-void border border-mw-phosphor/40"
          >
            <header className="flex items-center gap-3 px-4 py-2.5 border-b border-mw-phosphor/25 shrink-0">
              <span
                data-text="Curriculum Vitae"
                className="glitch font-display text-[13px] uppercase tracking-widest text-mw-phosphor"
              >
                Curriculum Vitae
              </span>

              <div className="ml-auto flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setTinted((v) => !v)}
                  aria-pressed={tinted}
                  title="Alternar el tinte holográfico para leer el PDF original"
                  className={`font-mono text-[9.5px] uppercase tracking-widest px-2 py-0.5 border transition-colors ${
                    tinted
                      ? "border-mw-phosphor/60 text-mw-phosphor"
                      : "border-steam-line text-steam-dim hover:text-steam-bright"
                  }`}
                >
                  tinte {tinted ? "on" : "off"}
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-steam-dim hover:text-mw-phosphor transition-colors"
                >
                  PESTAÑA NUEVA ↗
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="text-steam-dim hover:text-mw-rust text-lg leading-none transition-colors"
                >
                  ×
                </button>
              </div>
            </header>

            <div className="relative flex-1 min-h-0 bg-black">
              {/* El scroll va en una capa propia para que las escuadras y las
                  líneas de barrido queden fijas y no se desplacen con el PDF. */}
              <div className="absolute inset-0 overflow-y-auto">
                <CvProjection url={url} tinted={tinted} allPages className="w-full" />
              </div>
              <Overlays beam={false} />
              <Brackets />
            </div>

            <span aria-hidden className="block h-px holo-emitter shrink-0" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
