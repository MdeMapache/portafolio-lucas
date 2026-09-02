#!/usr/bin/env node
/**
 * Verifica que el backend de Supabase esté bien configurado.
 *
 *   node scripts/check-supabase.mjs
 *
 * Comprueba, en orden: que haya credenciales, que el host exista, que la
 * lectura pública funcione, que el bucket esté, y —lo más importante— que el
 * servidor RECHACE una escritura sin sesión.
 *
 * Esa última es la que de verdad importa: esconder el botón "Modificar perfil"
 * en la UI no protege nada. Si esa prueba no pasa, cualquiera puede sobrescribir
 * tu portafolio desde la consola del navegador.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Lee .env.local sin depender de dotenv. */
function readEnv() {
  let raw;
  try {
    raw = readFileSync(join(root, ".env.local"), "utf8");
  } catch {
    return {};
  }

  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = readEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let failures = 0;

function report(ok, label, detail) {
  if (!ok) failures++;
  console.log(`${ok ? "  OK  " : " FALLA"}  ${label}${detail ? ` — ${detail}` : ""}`);
}

console.log("\nVerificando backend de Supabase\n" + "─".repeat(50));

if (!url || !anon) {
  console.log(
    "\n  Todavía no hay credenciales en .env.local.\n" +
      "  La app está corriendo en modo local (localStorage + IndexedDB).\n\n" +
      "  Completá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
      "  y volvé a correr este script.\n",
  );
  process.exit(0);
}

const headers = { apikey: anon, Authorization: `Bearer ${anon}` };

// 1. ¿Existe el host? (el proyecto anterior había sido borrado)
try {
  const res = await fetch(`${url}/rest/v1/`, { headers });
  report(res.status < 500, "El proyecto responde", `HTTP ${res.status}`);
} catch (err) {
  report(false, "El proyecto responde", err.cause?.code ?? err.message);
  console.log("\n  El host no resuelve. Revisá la URL o si el proyecto sigue vivo.\n");
  process.exit(1);
}

// 2. Lectura pública del documento.
try {
  const res = await fetch(`${url}/rest/v1/portfolio?select=id&limit=1`, { headers });
  if (res.status === 200) {
    report(true, "Lectura pública de `portfolio`");
  } else if (res.status === 404) {
    report(false, "Lectura pública de `portfolio`", "la tabla no existe — falta correr el SQL");
  } else {
    report(false, "Lectura pública de `portfolio`", `HTTP ${res.status} ${await res.text()}`);
  }
} catch (err) {
  report(false, "Lectura pública de `portfolio`", err.message);
}

// 3. LA PRUEBA QUE IMPORTA: el servidor tiene que rechazar la escritura anónima.
//
// Se prueba con INSERT, no con UPDATE. Un UPDATE que RLS filtra no da error:
// simplemente no matchea filas y PostgREST devuelve 204, igual que un UPDATE
// sobre una tabla vacía. Los dos casos son indistinguibles, así que un 204 no
// prueba nada. Un INSERT bloqueado por RLS, en cambio, SIEMPRE devuelve
// 401/403 con "violates row-level security policy".
try {
  const res = await fetch(`${url}/rest/v1/portfolio`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ id: 1, document: { intrusion: true } }),
  });

  const body = await res.text();

  if (res.status === 401 || res.status === 403) {
    report(true, "RLS rechaza escritura anónima", `HTTP ${res.status}`);
  } else if (res.status === 409) {
    // La fila ya existe: el insert chocó con la PK antes de llegar a RLS.
    // No podemos concluir nada, así que probamos el UPDATE verificando de
    // verdad si el contenido cambió.
    report(true, "RLS rechaza insert anónimo", "fila ya existente, se verifica por UPDATE");
  } else {
    report(false, "RLS rechaza escritura anónima", `HTTP ${res.status} — ESCRITURA PERMITIDA`);
    console.log(
      `\n  ⚠️  CUALQUIERA PUEDE SOBRESCRIBIR TU PORTAFOLIO.\n` +
        `     Respuesta: ${body.slice(0, 200)}\n` +
        `     Las policies no están aplicadas. Corré supabase-setup.sql.\n`,
    );
  }
} catch (err) {
  report(false, "RLS rechaza escritura anónima", err.message);
}

// 3b. UPDATE anónimo verificado por lectura: `return=representation` devuelve
// las filas realmente modificadas. Un array vacío significa que no cambió nada.
try {
  const res = await fetch(`${url}/rest/v1/portfolio?id=eq.1`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ document: { intrusion: true } }),
  });

  if (res.status === 401 || res.status === 403) {
    report(true, "RLS rechaza update anónimo", `HTTP ${res.status}`);
  } else {
    const changed = await res.json().catch(() => []);
    const none = Array.isArray(changed) && changed.length === 0;
    report(none, "RLS rechaza update anónimo", none ? "0 filas modificadas" : "FILA MODIFICADA");

    if (!none) {
      console.log("\n  ⚠️  Un visitante sin sesión pudo modificar el documento.\n");
    }
  }
} catch (err) {
  report(false, "RLS rechaza update anónimo", err.message);
}

// 4. El bucket de archivos existe y se lee sin sesión.
try {
  const res = await fetch(`${url}/storage/v1/object/list/assets`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: "", limit: 1 }),
  });
  report(res.status === 200, "Bucket `assets` legible", `HTTP ${res.status}`);
} catch (err) {
  report(false, "Bucket `assets` legible", err.message);
}

// 5. Subida anónima al bucket: también tiene que fallar.
try {
  const res = await fetch(`${url}/storage/v1/object/assets/_probe-anon.txt`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "text/plain" },
    body: "probe",
  });

  const blocked = res.status === 400 || res.status === 401 || res.status === 403;
  report(blocked, "Storage rechaza subida anónima", `HTTP ${res.status}`);

  if (!blocked) {
    console.log("\n  ⚠️  Cualquiera puede subir archivos a tu bucket.\n");
  }
} catch (err) {
  report(false, "Storage rechaza subida anónima", err.message);
}

console.log("─".repeat(50));

if (failures === 0) {
  console.log("\n  Todo en orden. Reiniciá `npm run dev` y el portafolio\n" +
    "  arranca en modo remoto.\n");
} else {
  console.log(`\n  ${failures} verificación(es) fallaron. Ver detalle arriba.\n`);
  process.exit(1);
}
