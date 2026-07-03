import { supabase } from './supabase'

export async function fetchPublishedModules() {
  const { data, error } = await supabase
    .from('modules')
    .select('id, title, description, slug, sort_order')
    .eq('is_published', true)
    .order('sort_order')

  if (error) throw error
  return data ?? []
}

export async function fetchModuleBySlug(slug) {
  const { data, error } = await supabase
    .from('modules')
    .select('id, title, description, slug')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) throw error
  return data
}

export async function fetchPublishedSubmodules(moduleId) {
  const { data, error } = await supabase
    .from('submodules')
    .select('id, title, slug, sort_order')
    .eq('module_id', moduleId)
    .eq('is_published', true)
    .order('sort_order')

  if (error) throw error
  return data ?? []
}

export async function fetchSubmoduleContents(submoduleId) {
  const { data, error } = await supabase
    .from('contents')
    .select('id, type, title, body, file_url, sort_order')
    .eq('submodule_id', submoduleId)
    .eq('is_published', true)
    .order('sort_order')

  if (error) throw error
  return data ?? []
}
