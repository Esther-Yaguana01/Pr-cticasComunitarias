import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

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

const MODULES = [
  {
    title: 'Asesoría de imagen',
    description: 'Tipo de cuerpo, color y estilo propio',
    slug: 'asesoria-imagen',
    is_published: true,
    sort_order: 1,
  },
  {
    title: 'Nutrición',
    description: 'Alimentación saludable y hábitos',
    slug: 'nutricion',
    is_published: true,
    sort_order: 2,
  },
  {
    title: 'Cuidado de la piel',
    description: 'Rutinas y prevención de trastornos',
    slug: 'cuidado-piel',
    is_published: true,
    sort_order: 3,
  },
]

const { data: existing, error: listError } = await supabase
  .from('modules')
  .select('slug')
  .order('sort_order')

if (listError) {
  if (listError.message.includes('does not exist') || listError.code === '42P01') {
    console.error(
      'La tabla "modules" no existe. Ejecuta primero supabase/migrations/001_initial_schema.sql en el SQL Editor de Supabase.',
    )
  } else {
    console.error('Error al consultar módulos:', listError.message)
  }
  process.exit(1)
}

const existingSlugs = new Set((existing ?? []).map((row) => row.slug))

for (const module of MODULES) {
  if (existingSlugs.has(module.slug)) {
    const { error } = await supabase
      .from('modules')
      .update({
        title: module.title,
        description: module.description,
        is_published: module.is_published,
        sort_order: module.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', module.slug)

    if (error) {
      console.error(`Error al actualizar "${module.slug}":`, error.message)
      process.exit(1)
    }

    console.log(`Actualizado: ${module.title}`)
    continue
  }

  const { error } = await supabase.from('modules').insert(module)

  if (error) {
    console.error(`Error al insertar "${module.slug}":`, error.message)
    process.exit(1)
  }

  console.log(`Creado: ${module.title}`)
}

const { data: published, error: verifyError } = await supabase
  .from('modules')
  .select('title, slug, is_published, sort_order')
  .eq('is_published', true)
  .order('sort_order')

if (verifyError) {
  console.error('Error al verificar módulos:', verifyError.message)
  process.exit(1)
}

console.log('\nMódulos publicados (visibles para todos):')
for (const row of published ?? []) {
  console.log(`  ${row.sort_order}. ${row.title} (${row.slug})`)
}
