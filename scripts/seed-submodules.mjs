import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import { MODULE_SUBMODULES } from '../src/constants/submodules.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Faltan variables: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws },
})

async function seedSubmodulesForModule(moduleSlug, submodules) {
  const { data: module, error: moduleError } = await supabase
    .from('modules')
    .select('id, title')
    .eq('slug', moduleSlug)
    .single()

  if (moduleError) {
    console.error(`No se encontró el módulo "${moduleSlug}":`, moduleError.message)
    process.exit(1)
  }

  const { data: existing, error: listError } = await supabase
    .from('submodules')
    .select('slug')
    .eq('module_id', module.id)

  if (listError) {
    if (
      listError.message.includes('does not exist') ||
      listError.message.includes('schema cache') ||
      listError.code === '42P01'
    ) {
      console.error(`
La tabla "submodules" no existe en Supabase.

Solución:
1. Abre Supabase → SQL Editor → New query
2. Copia y ejecuta TODO el archivo:
   supabase/setup-submodules-completo.sql
3. Vuelve a correr: npm run seed:submodules
`)
    } else {
      console.error('Error al consultar submódulos:', listError.message)
    }
    process.exit(1)
  }

  const existingSlugs = new Set((existing ?? []).map((row) => row.slug))

  for (const submodule of submodules) {
    if (existingSlugs.has(submodule.slug)) {
      const { error } = await supabase
        .from('submodules')
        .update({
          title: submodule.title,
          is_published: true,
          sort_order: submodule.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq('module_id', module.id)
        .eq('slug', submodule.slug)

      if (error) {
        console.error(`Error al actualizar "${submodule.slug}":`, error.message)
        process.exit(1)
      }

      console.log(`  Actualizado: ${submodule.title}`)
      continue
    }

    const { error } = await supabase.from('submodules').insert({
      module_id: module.id,
      ...submodule,
      is_published: true,
    })

    if (error) {
      console.error(`Error al insertar "${submodule.slug}":`, error.message)
      process.exit(1)
    }

    console.log(`  Creado: ${submodule.title}`)
  }

  console.log(`\n✓ ${module.title} (${submodules.length} submódulos)\n`)
}

for (const [moduleSlug, submodules] of Object.entries(MODULE_SUBMODULES)) {
  console.log(`\n→ ${moduleSlug}`)
  await seedSubmodulesForModule(moduleSlug, submodules)
}

console.log('Todos los submódulos cargados correctamente.')
