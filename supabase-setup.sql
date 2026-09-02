-- ============================================================================
--  Portafolio — esquema de Supabase
--  Pegá esto entero en el SQL Editor de tu proyecto y corrélo una vez.
-- ============================================================================
--
--  MODELO DE SEGURIDAD (leelo antes de correr nada)
--
--  Un solo dueño. Cualquiera puede LEER el portafolio; sólo un usuario
--  autenticado puede ESCRIBIRLO. Como vas a deshabilitar los registros
--  (paso 4, abajo), el único usuario que existe sos vos — por eso las policies
--  pueden decir simplemente "authenticated" sin hardcodear tu email.
--
--  ⚠️ Si NO deshabilitás los registros, cualquiera puede crearse una cuenta y
--  con eso obtiene permiso de escritura sobre tu portafolio. Ese paso no es
--  opcional.
-- ============================================================================


-- ── 1. Tabla del documento ──────────────────────────────────────────────────
-- Todo el portafolio es un solo jsonb en una sola fila: se lee y se escribe
-- entero, así que normalizarlo en tablas separadas sólo agregaría joins.

create table if not exists public.portfolio (
  id         int primary key default 1,
  document   jsonb       not null,
  updated_at timestamptz not null default now(),
  -- Impide que aparezca una segunda fila por accidente.
  constraint portfolio_single_row check (id = 1)
);

alter table public.portfolio enable row level security;


-- ── 2. Policies de la tabla ─────────────────────────────────────────────────

-- Lectura: cualquiera, incluso sin sesión. El portafolio es público.
drop policy if exists "portfolio: lectura publica" on public.portfolio;
create policy "portfolio: lectura publica"
  on public.portfolio for select
  to anon, authenticated
  using (true);

-- Escritura: sólo con sesión. Esto es lo que realmente protege el portafolio;
-- esconder el botón "Modificar perfil" en la UI es sólo comodidad.
drop policy if exists "portfolio: insert autenticado" on public.portfolio;
create policy "portfolio: insert autenticado"
  on public.portfolio for insert
  to authenticated
  with check (true);

drop policy if exists "portfolio: update autenticado" on public.portfolio;
create policy "portfolio: update autenticado"
  on public.portfolio for update
  to authenticated
  using (true)
  with check (true);


-- ── 3. Bucket de archivos ───────────────────────────────────────────────────
-- Avatares, fondos GIF, CV en PDF y capturas. Público en lectura para que el
-- portafolio se vea sin login.

insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

drop policy if exists "assets: lectura publica" on storage.objects;
create policy "assets: lectura publica"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'assets');

drop policy if exists "assets: subida autenticada" on storage.objects;
create policy "assets: subida autenticada"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'assets');

drop policy if exists "assets: borrado autenticado" on storage.objects;
create policy "assets: borrado autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'assets');


-- ============================================================================
--  4. PASOS EN EL PANEL (no se pueden hacer desde SQL)
-- ============================================================================
--
--  a) Creá tu usuario:
--     Authentication → Users → Add user → email + contraseña.
--     Marcá "Auto Confirm User" para no tener que confirmar por mail.
--
--  b) ⚠️ DESHABILITÁ LOS REGISTROS — este es el paso que cierra el agujero:
--     Authentication → Providers → Email → apagá "Enable sign ups".
--     Sin esto, cualquiera se registra y gana permiso de escritura.
--
--  c) Copiá las credenciales a .env.local:
--     Project Settings → API
--       NEXT_PUBLIC_SUPABASE_URL       = Project URL
--       NEXT_PUBLIC_SUPABASE_ANON_KEY  = anon / publishable key
--
--     La anon key es pública por diseño: va en el bundle del navegador. Lo que
--     protege los datos son las policies de arriba, no el secreto de la key.
--     La `service_role` key NUNCA va en un archivo NEXT_PUBLIC_.
--
--  d) Reiniciá `npm run dev`. La app detecta las variables sola y pasa de
--     modo local a modo remoto.
--
-- ============================================================================
--  5. CÓMO VERIFICAR QUE QUEDÓ BIEN
-- ============================================================================
--
--  Abrí el portafolio en una ventana de incógnito (sin sesión):
--    · Se tiene que ver todo el contenido.
--    · NO tiene que aparecer el botón "Modificar perfil".
--
--  Y la prueba que de verdad importa — que el servidor rechaza la escritura,
--  no sólo que el botón está escondido. En la consola del navegador, sin
--  sesión iniciada:
--
--    await (await fetch(
--      `${URL}/rest/v1/portfolio?id=eq.1`,
--      { method: 'PATCH',
--        headers: { apikey: ANON, 'Content-Type': 'application/json' },
--        body: '{"document":{}}' }
--    )).status
--
--  Tiene que dar 401 o 403. Si da 204, las policies no están aplicadas.
-- ============================================================================
