"use client";

import { createPortal } from "react-dom";

/**
 * Monta a sus hijos directamente en `document.body`.
 *
 * Hace falta porque `position: fixed` NO se posiciona respecto al viewport si
 * algún ancestro tiene `transform`, `filter` o `backdrop-filter`: esas
 * propiedades crean un bloque contenedor y el modal queda anclado a ese
 * ancestro. Es exactamente lo que pasaba con el login dentro del `<nav>`, que
 * lleva `backdrop-blur-sm`.
 *
 * Sacando el modal del árbol de layout, ningún estilo de un padre lo puede
 * descolocar.
 *
 * No lleva guarda de "montado": los diálogos sólo se renderizan detrás de un
 * flag que arranca en false, así que nunca existen durante el SSR y no hay
 * riesgo de mismatch de hidratación.
 */
export default function Portal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}
