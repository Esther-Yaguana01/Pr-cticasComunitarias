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
