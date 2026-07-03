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

const BUCKET = 'contenidos'

const { data: buckets, error: listError } = await supabase.storage.listBuckets()

if (listError) {
  console.error('Error al listar buckets:', listError.message)
  process.exit(1)
}

const exists = buckets.some((bucket) => bucket.name === BUCKET || bucket.id === BUCKET)

if (exists) {
  console.log(`El bucket "${BUCKET}" ya existe.`)
} else {
  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 52428800,
    allowedMimeTypes: [
      'application/pdf',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/ogg',
    ],
  })

  if (createError) {
    console.error('Error al crear bucket:', createError.message)
    console.error(`
Si falla, créalo manualmente en Supabase:
1. Storage → New bucket
2. Nombre: contenidos
3. Marca "Public bucket"
4. Luego ejecuta supabase/setup-storage-completo.sql en SQL Editor
`)
    process.exit(1)
  }

  console.log(`Bucket "${BUCKET}" creado correctamente.`)
}

console.log(`
IMPORTANTE: Ejecuta también las políticas RLS en SQL Editor:
  supabase/setup-storage-completo.sql

Sin eso, la subida desde el admin puede fallar por permisos.
`)
