# Capa de persistencia y auth

Toda la app habla con tres interfaces y nunca con un backend concreto:

| Interfaz              | Qué resuelve                                  | Se define en    |
| --------------------- | --------------------------------------------- | --------------- |
| `PortfolioRepository` | El documento JSON (perfil, proyectos, stack…)  | `repository.ts` |
| `AssetStore`          | Binarios: avatar, fondo GIF, CV, capturas      | `repository.ts` |
| `AuthAdapter`         | Quién sos                                      | `auth.ts`       |

Documento y binarios están separados a propósito: casi todos los backends reales
los tratan como servicios distintos (Postgres + Storage, MongoDB + Cloudinary,
Firestore + Firebase Storage).

## Los dos modos

**Qué modo está activo lo deciden las variables de entorno**, no el código.
`isSupabaseConfigured()` mira si `NEXT_PUBLIC_SUPABASE_URL` y
`NEXT_PUBLIC_SUPABASE_ANON_KEY` están completas:

| | Modo local (sin env) | Modo Supabase (con env) |
| --- | --- | --- |
| Documento | localStorage | tabla `portfolio`, columna `jsonb` |
| Binarios | IndexedDB | Storage, bucket `assets` |
| Auth | frase en localStorage | Supabase Auth (email + contraseña) |
| Alcance | un navegador | todos |
| Seguridad real | ninguna (ni hace falta) | policies RLS |

Cambiar de modo es completar `.env.local` y reiniciar el dev server. Ni un
componente cambia. La selección vive en `index.ts` y en ningún otro lado.

**Por qué IndexedDB y no localStorage para los archivos:** localStorage sólo
guarda strings y topea en ~5 MB por origen. Un GIF de fondo pesa 3–8 MB, y en
base64 se infla otro 33%: reventaría la cuota con un solo fondo. IndexedDB
guarda `Blob` nativo y tiene cuota de cientos de MB.

## Modelo de seguridad

Un solo dueño. **Cualquiera lee, sólo el autenticado escribe.**

Lo importante: **esconder el botón "Modificar perfil" no es la protección**. Un
visitante puede abrir la consola y llamar a la API igual. Lo que realmente
protege son las policies RLS del lado del servidor, en
[`supabase-setup.sql`](../../../supabase-setup.sql). La UI escondida es sólo
comodidad, para no mostrarle controles inútiles a quien no puede usarlos.

Las policies dicen simplemente "authenticated puede escribir" en vez de
hardcodear un email. Eso funciona **porque los registros están deshabilitados**
en el panel de Supabase, así que el único usuario que existe es el dueño. Ese
paso no es opcional: sin él, cualquiera se registra y gana permiso de escritura.

La `anon key` es pública por diseño y viaja en el bundle del navegador; no es un
secreto y no protege nada. La `service_role` key nunca debe ir en una variable
`NEXT_PUBLIC_`.

### El login local no es seguridad

`LocalAuthAdapter` compara contra una frase que está en el bundle del cliente y
guarda la sesión en localStorage: cualquiera con las DevTools abiertas entra.
Existe para que el flujo de login/logout sea idéntico con y sin backend, y para
poder probarlo sin servidor. En modo local tampoco hay nada que proteger: los
datos viven en el navegador de cada visitante y nadie más los ve.

## Migrar a otro backend

Escribí clases que cumplan las interfaces y devolvelas en `index.ts`. Nada más.

| Backend | Documento | Binarios | Auth |
| --- | --- | --- | --- |
| Supabase *(implementado)* | tabla `jsonb` | Supabase Storage | Supabase Auth |
| MongoDB | doc en una colección | Cloudinary o S3 | NextAuth |
| Firebase | doc de Firestore | Firebase Storage | Firebase Auth |

Con MongoDB el acceso no puede ser directo desde el navegador: hace falta un
Route Handler (`src/app/api/portfolio/route.ts`) con `GET` y `PUT`, y el adapter
pasa a ser un `fetch` a esa ruta. Es una ventaja: la credencial de la base queda
en el servidor y el chequeo de permiso también.
