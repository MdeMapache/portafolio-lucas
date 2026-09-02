"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dibuja un PDF en canvas y lo tiñe de holograma **sin tocar las fotos**.
 *
 * Por qué no un <iframe> con un filtro CSS: un filtro se aplica al elemento
 * entero, así que el `invert` que convierte la hoja blanca en negra convierte
 * también la foto de perfil en un negativo. No hay forma de excluir una región.
 *
 * Rindiendo el PDF nosotros sí se puede: pdf.js expone la lista de operadores
 * de cada página, de donde se sacan las cajas de las imágenes incrustadas. El
 * tinte se aplica píxel por píxel salteando esas cajas, así que el texto queda
 * en cian sobre negro y las fotos quedan exactamente como en el PDF original.
 *
 * De regalo desaparecen las barras del visor de PDF del navegador y el
 * documento se ve igual en Chrome, Firefox y Safari.
 */

type Box = { x0: number; y0: number; x1: number; y1: number };

type RenderedPage = {
  canvas: HTMLCanvasElement;
  /** Píxeles sin teñir, para poder alternar el tinte sin volver a rasterizar. */
  original: ImageData;
  boxes: Box[];
};

/** Límite de resolución: por encima de 2x el costo sube y no se nota. */
const MAX_DPR = 2;

/** Margen extra alrededor de cada imagen, para que no le quede un halo teñido. */
const BOX_PAD = 2;

/**
 * Recorre la lista de operadores llevando la matriz de transformación actual y
 * devuelve, en coordenadas del canvas, dónde quedó cada imagen incrustada.
 *
 * El cuadrado unitario es el espacio propio de una imagen en PDF: al pasarlo
 * por la matriz vigente en el momento del `paint`, se obtienen sus cuatro
 * esquinas ya ubicadas en la página.
 */
function imageBoxes(
  pdfjs: typeof import("pdfjs-dist"),
  opList: { fnArray: number[]; argsArray: unknown[][] },
  viewportTransform: number[],
): Box[] {
  const { OPS, Util } = pdfjs;

  const paintOps = new Set<number>([
    OPS.paintImageXObject,
    OPS.paintImageXObjectRepeat,
    OPS.paintInlineImageXObject,
    OPS.paintInlineImageXObjectGroup,
    OPS.paintImageMaskXObject,
    OPS.paintImageMaskXObjectRepeat,
    OPS.paintImageMaskXObjectGroup,
  ]);

  const boxes: Box[] = [];
  const stack: number[][] = [];
  let ctm = viewportTransform.slice();

  for (let i = 0; i < opList.fnArray.length; i++) {
    const fn = opList.fnArray[i];

    if (fn === OPS.save) {
      stack.push(ctm.slice());
    } else if (fn === OPS.restore) {
      ctm = stack.pop() ?? ctm;
    } else if (fn === OPS.transform) {
      ctm = Util.transform(ctm, opList.argsArray[i] as number[]);
    } else if (paintOps.has(fn)) {
      const corners = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ].map((p) => Util.applyTransform(p, ctm));

      const xs = corners.map((c) => c[0]);
      const ys = corners.map((c) => c[1]);

      boxes.push({
        x0: Math.min(...xs) - BOX_PAD,
        y0: Math.min(...ys) - BOX_PAD,
        x1: Math.max(...xs) + BOX_PAD,
        y1: Math.max(...ys) + BOX_PAD,
      });
    }
  }

  return boxes;
}

/**
 * Invierte la luminancia y la lleva al cian, salteando las cajas de imagen.
 *
 * La máscara se rellena primero por rectángulos en vez de preguntar caja por
 * caja en cada píxel: son millones de píxeles y una decena de cajas.
 */
function tintOutsideBoxes(source: ImageData, boxes: Box[]): ImageData {
  const { width, height } = source;
  const out = new ImageData(new Uint8ClampedArray(source.data), width, height);
  const data = out.data;

  const mask = new Uint8Array(width * height);
  for (const b of boxes) {
    const x0 = Math.max(0, Math.floor(b.x0));
    const x1 = Math.min(width, Math.ceil(b.x1));
    const y0 = Math.max(0, Math.floor(b.y0));
    const y1 = Math.min(height, Math.ceil(b.y1));
    if (x1 <= x0) continue;
    for (let y = y0; y < y1; y++) mask.fill(1, y * width + x0, y * width + x1);
  }

  for (let i = 0, p = 0; p < mask.length; i += 4, p++) {
    if (mask[p]) continue;
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const inv = 255 - lum;
    data[i] = inv * 0.1;
    data[i + 1] = inv * 0.92;
    data[i + 2] = inv;
  }

  return out;
}

export default function CvProjection({
  url,
  tinted,
  allPages = false,
  className = "",
}: {
  url: string;
  tinted: boolean;
  /** `false` rinde sólo la primera página, para la vista previa. */
  allPages?: boolean;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<RenderedPage[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  // Cambia cuando termina una rasterización, para que el tinte se reaplique.
  const [renderNonce, setRenderNonce] = useState(0);

  // Rasterizado. Sólo depende del documento, no del tinte.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    setStatus("loading");

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");

        // El worker se resuelve como asset del bundle: así no hay que copiarlo
        // a public/ ni depender de un CDN externo.
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const doc = await pdfjs.getDocument(url).promise;
        if (cancelled) return;

        const width = host.clientWidth || 640;
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        const total = allPages ? doc.numPages : 1;
        const rendered: RenderedPage[] = [];

        for (let n = 1; n <= total; n++) {
          const page = await doc.getPage(n);
          if (cancelled) return;

          const unscaled = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: (width / unscaled.width) * dpr });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.className = "block w-full";

          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) throw new Error("sin contexto 2d");

          await page.render({ canvasContext: ctx, viewport }).promise;
          if (cancelled) return;

          rendered.push({
            canvas,
            original: ctx.getImageData(0, 0, canvas.width, canvas.height),
            boxes: imageBoxes(pdfjs, await page.getOperatorList(), viewport.transform),
          });
        }

        if (cancelled) return;

        host.replaceChildren(...rendered.map((p) => p.canvas));
        pagesRef.current = rendered;
        setStatus("ready");
        setRenderNonce((n) => n + 1);
      } catch (err) {
        if (cancelled) return;
        console.error("[cv] No se pudo rasterizar el PDF:", err);
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, allPages]);

  // Tinte. Se recalcula desde los píxeles originales, así que alternarlo no
  // degrada la imagen por aplicar el filtro dos veces.
  useEffect(() => {
    for (const page of pagesRef.current) {
      const ctx = page.canvas.getContext("2d");
      if (!ctx) continue;
      ctx.putImageData(tinted ? tintOutsideBoxes(page.original, page.boxes) : page.original, 0, 0);
    }
  }, [tinted, renderNonce]);

  return (
    <div className={`relative ${className}`}>
      <div ref={hostRef} className="w-full" aria-hidden />

      {status !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-mono text-[11px] ${
              status === "error" ? "text-cyber-magenta" : "text-cyber-cyan/70 animate-pulse"
            }`}
          >
            {status === "error" ? "NO SE PUDO PROYECTAR EL DOCUMENTO" : "PROYECTANDO…"}
          </span>
        </div>
      ) : null}
    </div>
  );
}
