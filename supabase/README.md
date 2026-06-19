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

## 3. Probar el panel admin

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
