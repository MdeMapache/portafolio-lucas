/**
 * Le pone una versión al paquete del juego en el HTML que genera Godot.
 *
 * Godot exporta siempre con los mismos nombres: index.html, index.pck,
 * index.wasm. Como la URL del .pck no cambia entre builds, un navegador que ya
 * lo tenga cacheado sigue jugando el nivel viejo aunque publiques uno nuevo.
 * Eso pasó de verdad: la demo quedó congelada en la versión del 3 de septiembre.
 *
 * La solución es que la URL cambie cuando cambia el contenido. Este script
 * calcula el hash del .pck y lo mete como `mainPack` en la configuración del
 * motor, que Godot consulta antes de armar la ruta por defecto:
 *
 *     mainPack || `${exe}.pck`
 *
 * El index.html se sirve con must-revalidate, así que el navegador siempre trae
 * el HTML fresco, ve la URL nueva y baja el paquete nuevo. Y como cada versión
 * vive en su propia URL, la copia vieja puede quedarse cacheada sin molestar.
 *
 * Hay que volver a correrlo después de cada exportación, porque Godot
 * reescribe el index.html desde cero. Usá `npm run demo:exportar`, que hace
 * las dos cosas.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const DIR = "public/demos/runner-2d";
const html = `${DIR}/index.html`;
const pck = `${DIR}/index.pck`;

const version = createHash("sha1").update(readFileSync(pck)).digest("hex").slice(0, 12);

const fuente = readFileSync(html, "utf8");
const linea = /const GODOT_CONFIG = (\{.*?\});/s;
const encontrado = fuente.match(linea);
if (!encontrado) {
  console.error("No encontré GODOT_CONFIG en el index.html. ¿Cambió el formato del export?");
  process.exit(1);
}

const config = JSON.parse(encontrado[1]);
config.mainPack = `index.pck?v=${version}`;

writeFileSync(html, fuente.replace(linea, `const GODOT_CONFIG = ${JSON.stringify(config)};`));
console.log(`  sellado: index.pck?v=${version}`);
