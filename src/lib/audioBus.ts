/**
 * Canal mínimo para que cualquier parte de la app pida silenciar la música sin
 * conocer al reproductor.
 *
 * Existe para un caso concreto: cuando arranca un demo embebido, el juego trae
 * su propio audio y competir con la banda sonora del sitio es insoportable. La
 * sección Demos no debería tener que importar el AudioController ni recibirlo
 * por props sólo para eso.
 *
 * Es un "duck" y no un apagado: cuando el demo termina, la música vuelve al
 * estado en el que estaba, sin pisar la preferencia del usuario.
 */

const DUCK_EVENT = "portafolio:audio-duck";

export type DuckDetail = { ducked: boolean };

/** Pide silenciar (true) o devolver (false) la música de fondo. */
export function duckAudio(ducked: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<DuckDetail>(DUCK_EVENT, { detail: { ducked } }));
}

/** Se suscribe a los pedidos de silencio. Devuelve la función para desuscribirse. */
export function onDuckAudio(callback: (ducked: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  function handler(event: Event) {
    callback((event as CustomEvent<DuckDetail>).detail.ducked);
  }

  window.addEventListener(DUCK_EVENT, handler);
  return () => window.removeEventListener(DUCK_EVENT, handler);
}
