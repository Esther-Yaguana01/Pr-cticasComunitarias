# Fase 1 — Configuración Supabase

## 1. Ejecutar la migración

1. Abre [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto.
2. Ve a **SQL Editor** → **New query**.
3. Copia y ejecuta el contenido de `supabase/migrations/001_initial_schema.sql`.

## 2. Crear el superadministrador

1. En Supabase → **Settings** → **API**, copia la **service_role** key (nunca la subas a Git).
2. En tu `.env` local agrega:

```env
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
ADMIN_EMAIL=admin@tuproyecto.com
ADMIN_PASSWORD=ContraseñaSegura123
```

3. Ejecuta:

```bash
npm run seed:admin
```

## 3. Cargar los módulos educativos

Los módulos publicados son visibles para **cualquier visitante** (sin login) gracias a la política RLS `modules_select_published_or_admin`.

**Opción A — Script local (recomendado)**

```bash
npm run seed:modules
```

**Opción B — SQL Editor**

Ejecuta `supabase/migrations/002_seed_modules.sql` (o la sección `INSERT` al final de `001_initial_schema.sql`).

**Verificar en Supabase**

1. **Table Editor** → `modules` → deben aparecer 3 filas con `is_published = true`.
2. **SQL Editor**:

```sql
SELECT title, slug, is_published, sort_order
FROM public.modules
WHERE is_published = TRUE
ORDER BY sort_order;
```

## 4. Probar el panel admin

1. `npm run dev`
2. Abre `http://localhost:5173/admin/login`
3. Ingresa con `ADMIN_EMAIL` y `ADMIN_PASSWORD`

## Rutas disponibles

| Ruta | Acceso |
|------|--------|
| `/` | Público |
| `/modules` | Público |
| `/register` | Público |
| `/progress` | Cuidadora autenticada |
| `/suggestions` | Público |
| `/admin/login` | Login admin (oculto del menú) |
| `/admin` | SUPER_ADMIN |
| `/admin/modules` | SUPER_ADMIN |
| `/admin/contents` | SUPER_ADMIN |
| `/admin/suggestions` | SUPER_ADMIN |
