/**
 * Exporta el juego de Godot a la carpeta del demo y lo deja listo para publicar.
 *
 * Son dos pasos que hay que hacer siempre juntos: exportar, y sellar el paquete
 * con su hash (ver sellar-demo.mjs). Si se hace sólo el primero, Godot reescribe
 * el index.html y se pierde el sellado, con lo que la demo queda cacheada en la
 * versión anterior sin que nada avise.
 *
 * El ejecutable de Godot no está en el PATH, así que se busca en las rutas
 * habituales o se toma de la variable de entorno GODOT.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const PROYECTO = join(homedir(), "Documents", "GitHub", "scroll");
const SALIDA = join(process.cwd(), "public", "demos", "runner-2d", "index.html");

function buscarGodot() {
  if (process.env.GODOT) return process.env.GODOT;
  const docs = join(homedir(), "Documents");
  const candidato = existsSync(docs)
    ? readdirSync(docs).find((f) => /^Godot_v.*\.exe$/i.test(f))
    : null;
  if (candidato) return join(docs, candidato);
  return null;
}

const godot = buscarGodot();
if (!godot) {
  console.error("No encontré el ejecutable de Godot. Pasalo en la variable GODOT.");
  process.exit(1);
}
if (!existsSync(join(PROYECTO, "project.godot"))) {
  console.error(`No encontré el proyecto del juego en ${PROYECTO}.`);
  process.exit(1);
}

console.log(`  exportando desde ${PROYECTO}`);
execFileSync(godot, ["--headless", "--path", PROYECTO, "--export-release", "Web", SALIDA], {
  stdio: ["ignore", "ignore", "inherit"],
});

execFileSync(process.execPath, ["scripts/sellar-demo.mjs"], { stdio: "inherit" });
console.log("  listo. Revisá el juego y después commiteá public/demos/runner-2d/.");
