import { deleteStorageFile, normalizeVideoUrl, uploadContentFile } from './storage'
import { supabase } from './supabase'

export async function fetchModulesWithSubmodules() {
  const [modulesResult, submodulesResult] = await Promise.all([
    supabase.from('modules').select('id, title, slug, sort_order').order('sort_order'),
    supabase.from('submodules').select('id, module_id, title, slug, sort_order').order('sort_order'),
  ])

  if (modulesResult.error) throw modulesResult.error
  if (submodulesResult.error) throw submodulesResult.error

  return (modulesResult.data ?? []).map((module) => ({
    ...module,
    submodules: (submodulesResult.data ?? []).filter((item) => item.module_id === module.id),
  }))
}

export async function fetchContentsBySubmodule(submoduleId) {
  const { data, error } = await supabase
    .from('contents')
    .select('id, module_id, submodule_id, type, title, body, file_url, is_published, sort_order, created_at')
    .eq('submodule_id', submoduleId)
    .order('sort_order')

  if (error) throw error
  return data ?? []
}

async function getNextSortOrder(submoduleId) {
  const { data, error } = await supabase
    .from('contents')
    .select('sort_order')
    .eq('submodule_id', submoduleId)
    .order('sort_order', { ascending: false })
    .limit(1)

  if (error) throw error
  return (data?.[0]?.sort_order ?? 0) + 1
}

export async function createContent({
  moduleId,
  submoduleId,
  moduleSlug,
  submoduleSlug,
  type,
  title,
  body,
  file,
  fileUrl,
  isPublished,
}) {
  let finalUrl = fileUrl?.trim() || null

  if (file) {
    finalUrl = await uploadContentFile(supabase, file, { moduleSlug, submoduleSlug })
  }

  if (type === 'video' && finalUrl && !file) {
    finalUrl = normalizeVideoUrl(finalUrl)
  }

  if (!finalUrl) {
    throw new Error('Debes subir un archivo o indicar una URL.')
  }

  const sortOrder = await getNextSortOrder(submoduleId)

  const { data, error } = await supabase
    .from('contents')
    .insert({
      module_id: moduleId,
      submodule_id: submoduleId,
      type,
      title,
      body: body?.trim() || null,
      file_url: finalUrl,
      is_published: isPublished,
      sort_order: sortOrder,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateContentPublished(contentId, isPublished) {
  const { data, error } = await supabase
    .from('contents')
    .update({ is_published: isPublished, updated_at: new Date().toISOString() })
    .eq('id', contentId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteContent(content) {
  if (content.file_url) {
    try {
      await deleteStorageFile(supabase, content.file_url)
    } catch {
      // Si el archivo es externo (YouTube) o ya no existe, igual eliminamos el registro.
    }
  }

  const { error } = await supabase.from('contents').delete().eq('id', content.id)
  if (error) throw error
}
