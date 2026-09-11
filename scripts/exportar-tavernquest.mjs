/**
 * Compila TavernQuest a web y lo deja publicado como demo del portafolio.
 *
 * La demo no es una maqueta: es el proyecto Flutter recuperado del APK,
 * compilado a web y corriendo contra Firebase con acceso anónimo.
 *
 * Son cuatro pasos que hay que hacer siempre juntos, y por eso viven acá:
 *
 *  1. `flutter build web` con `--base-href`. Sin eso Flutter escribe
 *     `<base href="/">` y el navegador busca `flutter_bootstrap.js` en la raíz
 *     del sitio en vez de en la carpeta de la demo: 404 y pantalla en blanco.
 *  2. Borrar los `.symbols`, 8 MB de mapas de símbolos que sólo sirven para
 *     depurar el motor.
 *  3. Recomprimir los dos assets pesados. El proyecto trae 69 minutos de música
 *     a 233 kbps —120 MB en un archivo, que es también por lo que el APK pesa
 *     177 MB— y un fondo de 1536x2754. Sin este paso la demo pesa 163 MB.
 *  4. Copiar el resultado a public/demos/tavern-quest/.
 *
 * Los assets se recomprimen SOBRE EL BUILD, nunca sobre el proyecto: en Android
 * la música completa se queda como está.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, rmSync, statSync, unlinkSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const PROYECTO = join(homedir(), "Desktop", "TavernQuest_recuperado", "app");
const BUILD = join(PROYECTO, "build", "web");
const DESTINO = join(process.cwd(), "public", "demos", "tavern-quest");
const BASE_HREF = "/demos/tavern-quest/";

/** 4 minutos alcanzan para un bucle de fondo; los 69 originales no se publican. */
const AUDIO_SEGUNDOS = 240;
const AUDIO_BITRATE = "96k";
/** La mitad del original: sigue siendo 2x para una columna de ancho de teléfono. */
const FONDO_ANCHO = 768;

function paso(texto) {
  console.log(`  ${texto}`);
}

function correr(cmd, args, opciones = {}) {
  execFileSync(cmd, args, { stdio: "inherit", ...opciones });
}

if (!existsSync(join(PROYECTO, "pubspec.yaml"))) {
  console.error(`No encontré el proyecto de TavernQuest en ${PROYECTO}.`);
  process.exit(1);
}

// 1 ─ Compilar -------------------------------------------------------------
/*
  En Windows `flutter` es un .bat y Node no puede lanzarlo directamente: hay que
  pasar por cmd.exe. Se lo invoca a mano en vez de usar `shell: true`, que hace
  lo mismo pero concatenando los argumentos sin escapar —y que Node deprecó
  justamente por eso—. Así los argumentos siguen viajando como lista.
*/
const argsFlutter = ["build", "web", "--release", `--base-href=${BASE_HREF}`];

paso(`compilando desde ${PROYECTO}`);
if (process.platform === "win32") {
  correr("cmd.exe", ["/c", "flutter.bat", ...argsFlutter], { cwd: PROYECTO });
} else {
  correr("flutter", argsFlutter, { cwd: PROYECTO });
}

// 2 ─ Descartar los mapas de símbolos --------------------------------------
let symbolsBorrados = 0;
function limpiarSymbols(dir) {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) limpiarSymbols(ruta);
    else if (entrada.name.endsWith(".symbols")) {
      unlinkSync(ruta);
      symbolsBorrados++;
    }
  }
}
limpiarSymbols(join(BUILD, "canvaskit"));
paso(`${symbolsBorrados} archivos .symbols descartados`);

// 3 ─ Recomprimir los assets pesados ---------------------------------------
const audio = join(BUILD, "assets", "assets", "audio", "musica_cantina.mp3");
const fondo = join(BUILD, "assets", "assets", "images", "cantina_base.png");

function mb(ruta) {
  return (statSync(ruta).size / 1048576).toFixed(1);
}

try {
  if (existsSync(audio)) {
    const antes = mb(audio);
    const tmp = `${audio}.tmp.mp3`;
    correr("ffmpeg", [
      "-y", "-v", "error", "-i", audio,
      "-t", String(AUDIO_SEGUNDOS),
      "-ac", "1",
      "-b:a", AUDIO_BITRATE,
      "-af", `afade=t=out:st=${AUDIO_SEGUNDOS - 5}:d=5`,
      tmp,
    ]);
    rmSync(audio);
    cpSync(tmp, audio);
    rmSync(tmp);
    paso(`música ${antes} MB → ${mb(audio)} MB`);
  }

  if (existsSync(fondo)) {
    const antes = mb(fondo);
    const tmp = `${fondo}.tmp.png`;
    correr("ffmpeg", ["-y", "-v", "error", "-i", fondo, "-vf", `scale=${FONDO_ANCHO}:-1`, tmp]);
    rmSync(fondo);
    cpSync(tmp, fondo);
    rmSync(tmp);
    paso(`fondo ${antes} MB → ${mb(fondo)} MB`);
  }
} catch (err) {
  console.error(
    "\nNo pude recomprimir los assets. ¿Está ffmpeg en el PATH?\n" +
      "Sin este paso la demo pesa 163 MB, así que no la publico a medias.\n",
    err.message,
  );
  process.exit(1);
}

// 4 ─ Publicar --------------------------------------------------------------
rmSync(DESTINO, { recursive: true, force: true });
cpSync(BUILD, DESTINO, { recursive: true });

let total = 0;
function pesar(dir) {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) pesar(ruta);
    else total += statSync(ruta).size;
  }
}
pesar(DESTINO);

paso(`publicado en public/demos/tavern-quest/ — ${(total / 1048576).toFixed(1)} MB`);
console.log("  listo. Probá la demo y después commiteá public/demos/tavern-quest/.");
