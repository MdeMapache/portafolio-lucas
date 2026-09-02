# Demos autohospedados

Cada demo va en su propia carpeta acá dentro:

```
public/demos/
  runner-2d/
    index.html
    index.js
    index.wasm
    index.pck
```

Después se carga la ruta en **Modificar perfil → Proyectos → Demo en vivo**:

```
/demos/runner-2d/index.html
```

Con eso aparece embebido en la pestaña Demos. No hace falta tocar código: la
sección muestra cualquier proyecto que tenga `demoUrl`.

---

## Demos autocontenidos (HTML/JS)

`tavern-quest/` es de este tipo: un solo `index.html` con el CSS y el JS
adentro, más las imágenes en su `img/`. Pesa unos 130 KB en total, así que no
hace falta pensar en el peso del repo como con un export de Godot.

Dos restricciones que impone el entorno, y que no son obvias hasta que algo
falla en silencio:

- **COEP `require-corp`.** `next.config.ts` aísla `/demos/`, así que el
  documento **no puede cargar nada de otro origen**: ni CDNs, ni Google Fonts,
  ni imágenes remotas. Todo va inline o en la propia carpeta. No hay error
  visible: el recurso simplemente no llega.
- **El `sandbox` del iframe no incluye `allow-modals`.** `alert()`, `confirm()`
  y `prompt()` no hacen nada. Hay que usar diálogos propios en el DOM.

También conviene que funcione a **320 px de alto**, que es como arranca el
iframe antes de que alguien apriete `[ + ]`.

---

## Exportar desde Godot 4

### La decisión que importa: hilos sí o no

Godot exporta a web con **hilos activados** por defecto. Eso usa
`SharedArrayBuffer`, que el navegador sólo habilita en documentos con
*aislamiento de origen* (las cabeceras COOP/COEP que ya configuré en
`next.config.ts` para `/demos/`).

El problema: **un iframe aislado exige que toda la cadena del documento también
lo esté**. Tu portafolio no lo está — y no puede estarlo sin romper las imágenes
que vienen de Supabase Storage.

Traducido:

| Export | Se ve embebido en la pestaña Demos | Rendimiento |
| --- | --- | --- |
| **Sin hilos** | Sí | Menor, un solo hilo |
| Con hilos | No, sólo abriéndolo en pestaña propia | Mejor |

**Para que se vea dentro del portafolio: exportá sin hilos.**

En el diálogo de exportación web de Godot buscá la opción de *Thread Support*
(en Godot 4.3 y posteriores es una casilla; en versiones anteriores no se puede
desactivar y no queda otra que abrirlo en pestaña propia).

### Pasos

1. **Editor → Export → Add… → Web.** Si dice que faltan las plantillas:
   *Editor → Manage Export Templates → Download and Install*.
2. Desactivá **Thread Support** (ver arriba).
3. En **Export Path**, apuntá a `public/demos/<nombre>/index.html` de este repo.
   El nombre del archivo tiene que ser `index.html`.
4. Exportá con **Export Project** (no "Export PCK/ZIP").
5. Cargá `/demos/<nombre>/index.html` como *Demo en vivo* del proyecto.

### Antes de subirlo, revisá

- **Peso.** Un export de Godot arranca en 15–40 MB entre `.wasm` y `.pck`. Eso
  se descarga entero antes de que el juego arranque, y queda versionado en git
  para siempre. Si pesa mucho, conviene subirlo a Supabase Storage o a itch.io
  en vez de al repo.
- **Controles táctiles.** El juego es para Android. En escritorio, los controles
  táctiles no responden al mouse salvo que hayas activado *Emulate Touch From
  Mouse* en la configuración del proyecto (Input Devices → Pointing).
- **Audio.** El navegador no deja sonar nada hasta que el usuario interactúa. Es
  normal que el juego arranque mudo hasta el primer clic.
- **Los `.wasm` no se comprimen en git.** Cada versión que commitees queda entera
  en la historia del repositorio.

---

## La alternativa: itch.io

Si el build pesa mucho o querés evitar el problema de los hilos, subilo a
itch.io y cargá esa URL como *Demo en vivo*. itch.io ya sirve las cabeceras de
aislamiento correctas.

El costo es que **itch.io no permite embeberse en un iframe ajeno**: la pestaña
Demos va a mostrar el recuadro vacío y hay que entrar con el botón `ABRIR ↗`.
La sección ya avisa de eso cuando pasa.
