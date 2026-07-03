const BUCKET = 'contenidos'

export function normalizeVideoUrl(url) {
  if (!url) return url

  const trimmed = url.trim()
  const watchMatch = trimmed.match(/youtube\.com\/watch\?v=([^&]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`

  const shortMatch = trimmed.match(/youtu\.be\/([^?]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`

  return trimmed
}

export function isDirectVideoFile(url) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url ?? '')
}

function sanitizeFileName(name) {
  return name.replace(/[^\w.-]+/g, '-').toLowerCase()
}

export function getStoragePathFromPublicUrl(url) {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + marker.length))
}

export async function uploadContentFile(supabase, file, { moduleSlug, submoduleSlug }) {
  const path = `${moduleSlug}/${submoduleSlug}/${Date.now()}-${sanitizeFileName(file.name)}`

  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    if (error.message?.includes('Bucket not found')) {
      throw new Error(
        'El bucket "contenidos" no existe. Ejecuta: npm run setup:storage (y luego supabase/setup-storage-completo.sql en SQL Editor).',
      )
    }
    throw error
  }

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
  return publicData.publicUrl
}

export async function deleteStorageFile(supabase, publicUrl) {
  const path = getStoragePathFromPublicUrl(publicUrl)
  if (!path) return

  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
