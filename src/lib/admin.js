import { supabase } from './supabase'

export async function fetchAdminDashboard() {
  const [modulesResult, submodulesResult, contentsResult, caregiversResult, suggestionsResult] =
    await Promise.all([
      supabase.from('modules').select('id, title, description, slug, is_published, sort_order').order('sort_order'),
      supabase.from('submodules').select('id, module_id, is_published'),
      supabase.from('contents').select('id, module_id, type, is_published'),
      supabase.from('profiles').select('id').eq('role', 'CAREGIVER'),
      supabase.from('suggestions').select('id, is_read'),
    ])

  const firstError =
    modulesResult.error ??
    submodulesResult.error ??
    contentsResult.error ??
    caregiversResult.error ??
    suggestionsResult.error

  if (firstError) throw firstError

  const modules = modulesResult.data ?? []
  const submodules = submodulesResult.data ?? []
  const contents = contentsResult.data ?? []
  const caregivers = caregiversResult.data ?? []
  const suggestions = suggestionsResult.data ?? []

  const publishedModules = modules.filter((module) => module.is_published)
  const publishedSubmodules = submodules.filter((item) => item.is_published)
  const publishedContents = contents.filter((item) => item.is_published)
  const pdfCount = publishedContents.filter((item) => item.type === 'pdf').length
  const videoCount = publishedContents.filter((item) => item.type === 'video').length
  const unreadSuggestions = suggestions.filter((item) => !item.is_read).length

  const modulesWithCounts = modules.map((module) => {
    const moduleSubmodules = submodules.filter((item) => item.module_id === module.id)
    const moduleContents = contents.filter((item) => item.module_id === module.id)

    return {
      ...module,
      submoduleCount: moduleSubmodules.length,
      publishedSubmoduleCount: moduleSubmodules.filter((item) => item.is_published).length,
      contentCount: moduleContents.length,
      publishedContentCount: moduleContents.filter((item) => item.is_published).length,
      pdfCount: moduleContents.filter((item) => item.type === 'pdf' && item.is_published).length,
      videoCount: moduleContents.filter((item) => item.type === 'video' && item.is_published).length,
    }
  })

  return {
    stats: {
      modulesTotal: modules.length,
      modulesPublished: publishedModules.length,
      submodulesTotal: submodules.length,
      submodulesPublished: publishedSubmodules.length,
      contentsTotal: contents.length,
      contentsPublished: publishedContents.length,
      pdfCount,
      videoCount,
      caregiversTotal: caregivers.length,
      suggestionsTotal: suggestions.length,
      suggestionsUnread: unreadSuggestions,
    },
    modules: modulesWithCounts,
  }
}
