import { useEffect, useState } from 'react'
import {
  fetchModuleBySlug,
  fetchPublishedSubmodules,
  fetchSubmoduleContents,
} from '../lib/modules'

export function useModuleDetail(slug) {
  const [module, setModule] = useState(null)
  const [submodules, setSubmodules] = useState([])
  const [contentsBySubmodule, setContentsBySubmodule] = useState({})
  const [activeSubmoduleId, setActiveSubmoduleId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    let mounted = true

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const moduleData = await fetchModuleBySlug(slug)
        if (!mounted) return

        setModule(moduleData)

        const submoduleList = await fetchPublishedSubmodules(moduleData.id)
        if (!mounted) return

        setSubmodules(submoduleList)
        setActiveSubmoduleId(submoduleList[0]?.id ?? null)

        const contentsEntries = await Promise.all(
          submoduleList.map(async (submodule) => {
            const contents = await fetchSubmoduleContents(submodule.id)
            return [submodule.id, contents]
          }),
        )

        if (!mounted) return
        setContentsBySubmodule(Object.fromEntries(contentsEntries))
      } catch (err) {
        if (mounted) {
          const message = err.message ?? 'No se pudo cargar el módulo'
          if (message.includes('schema cache') || message.includes('submodules')) {
            setError(
              'Falta crear la tabla submodules en Supabase. Ejecuta el archivo supabase/setup-submodules-completo.sql en el SQL Editor y recarga la página.',
            )
          } else {
            setError(message)
          }
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [slug])

  const activeSubmodule = submodules.find((item) => item.id === activeSubmoduleId) ?? null
  const activeContents = activeSubmoduleId ? (contentsBySubmodule[activeSubmoduleId] ?? []) : []

  return {
    module,
    submodules,
    activeSubmodule,
    activeContents,
    activeSubmoduleId,
    setActiveSubmoduleId,
    loading,
    error,
  }
}
