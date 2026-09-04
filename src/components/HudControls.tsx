import AudioController from "./AudioController";
import TextScaleController from "./TextScaleController";

/**
 * Barra de controles del visitante, fija arriba a la derecha.
 *
 * Agrupa audio y tamaño de texto en un solo bloque para que se lean como un
 * panel de instrumentos y no como dos widgets sueltos. El posicionamiento vive
 * acá y no en cada control, así se agrega uno nuevo sin volver a resolver dónde
 * va.
 *
 * `z-40` la deja por encima del contenido pero por debajo de los diálogos, que
 * usan `z-50`.
 */
export default function HudControls() {
  return (
    <div className="fixed top-3 right-3 z-40 flex flex-wrap items-center justify-end gap-2">
      <TextScaleController />
      <AudioController />
    </div>
  );
}
