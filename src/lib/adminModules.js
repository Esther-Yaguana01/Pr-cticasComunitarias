import { supabase } from './supabase'

export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function fetchAdminModules() {
  const [modulesResult, submodulesResult] = await Promise.all([
    supabase
      .from('modules')
      .select('id, title, description, slug, is_published, sort_order, created_at, updated_at')
      .order('sort_order'),
    supabase
      .from('submodules')
      .select('id, module_id, title, slug, is_published, sort_order')
      .order('sort_order'),
  ])

  if (modulesResult.error) throw modulesResult.error
  if (submodulesResult.error) throw submodulesResult.error

  const submodules = submodulesResult.data ?? []

  return (modulesResult.data ?? []).map((module) => ({
    ...module,
    submodules: submodules.filter((item) => item.module_id === module.id),
  }))
}

async function getNextModuleSortOrder() {
  const { data, error } = await supabase
    .from('modules')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  if (error) throw error
  return (data?.[0]?.sort_order ?? 0) + 1
}

async function getNextSubmoduleSortOrder(moduleId) {
  const { data, error } = await supabase
    .from('submodules')
    .select('sort_order')
    .eq('module_id', moduleId)
    .order('sort_order', { ascending: false })
    .limit(1)

  if (error) throw error
  return (data?.[0]?.sort_order ?? 0) + 1
}

export async function createModule({ title, description, slug, isPublished }) {
  const cleanTitle = title.trim()
  const cleanSlug = (slug?.trim() || slugify(cleanTitle))

  if (!cleanTitle) throw new Error('El título es obligatorio.')
  if (!cleanSlug) throw new Error('El slug es obligatorio.')

  const sortOrder = await getNextModuleSortOrder()

  const { data, error } = await supabase
    .from('modules')
    .insert({
      title: cleanTitle,
      description: description?.trim() || null,
      slug: cleanSlug,
      is_published: Boolean(isPublished),
      sort_order: sortOrder,
    })
    .select('id, title, description, slug, is_published, sort_order, created_at, updated_at')
    .single()

  if (error) {
    if (error.code === '23505') throw new Error('Ya existe un módulo con ese slug.')
    throw error
  }

  return { ...data, submodules: [] }
}

export async function updateModule(moduleId, { title, description, slug, isPublished, sortOrder }) {
  const cleanTitle = title.trim()
  const cleanSlug = (slug?.trim() || slugify(cleanTitle))

  if (!cleanTitle) throw new Error('El título es obligatorio.')
  if (!cleanSlug) throw new Error('El slug es obligatorio.')

  const { data, error } = await supabase
    .from('modules')
    .update({
      title: cleanTitle,
      description: description?.trim() || null,
      slug: cleanSlug,
      is_published: Boolean(isPublished),
      sort_order: Number(sortOrder) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', moduleId)
    .select('id, title, description, slug, is_published, sort_order, created_at, updated_at')
    .single()

  if (error) {
    if (error.code === '23505') throw new Error('Ya existe un módulo con ese slug.')
    throw error
  }

  return data
}

export async function updateModulePublished(moduleId, isPublished) {
  const { error } = await supabase
    .from('modules')
    .update({
      is_published: Boolean(isPublished),
      updated_at: new Date().toISOString(),
    })
    .eq('id', moduleId)

  if (error) throw error
}

export async function deleteModule(moduleId) {
  const { error } = await supabase.from('modules').delete().eq('id', moduleId)
  if (error) throw error
}

export async function createSubmodule({ moduleId, title, slug, isPublished }) {
  const cleanTitle = title.trim()
  const cleanSlug = (slug?.trim() || slugify(cleanTitle))

  if (!cleanTitle) throw new Error('El título del submódulo es obligatorio.')
  if (!cleanSlug) throw new Error('El slug del submódulo es obligatorio.')

  const sortOrder = await getNextSubmoduleSortOrder(moduleId)

  const { data, error } = await supabase
    .from('submodules')
    .insert({
      module_id: moduleId,
      title: cleanTitle,
      slug: cleanSlug,
      is_published: Boolean(isPublished),
      sort_order: sortOrder,
    })
    .select('id, module_id, title, slug, is_published, sort_order')
    .single()

  if (error) {
    if (error.code === '23505') throw new Error('Ya existe un submódulo con ese slug en este módulo.')
    throw error
  }

  return data
}

export async function updateSubmodule(submoduleId, { title, slug, isPublished, sortOrder }) {
  const cleanTitle = title.trim()
  const cleanSlug = (slug?.trim() || slugify(cleanTitle))

  if (!cleanTitle) throw new Error('El título del submódulo es obligatorio.')
  if (!cleanSlug) throw new Error('El slug del submódulo es obligatorio.')

  const { data, error } = await supabase
    .from('submodules')
    .update({
      title: cleanTitle,
      slug: cleanSlug,
      is_published: Boolean(isPublished),
      sort_order: Number(sortOrder) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', submoduleId)
    .select('id, module_id, title, slug, is_published, sort_order')
    .single()

  if (error) {
    if (error.code === '23505') throw new Error('Ya existe un submódulo con ese slug en este módulo.')
    throw error
  }

  return data
}

export async function updateSubmodulePublished(submoduleId, isPublished) {
  const { error } = await supabase
    .from('submodules')
    .update({
      is_published: Boolean(isPublished),
      updated_at: new Date().toISOString(),
    })
    .eq('id', submoduleId)

  if (error) throw error
}

export async function deleteSubmodule(submoduleId) {
  const { error } = await supabase.from('submodules').delete().eq('id', submoduleId)
  if (error) throw error
}
