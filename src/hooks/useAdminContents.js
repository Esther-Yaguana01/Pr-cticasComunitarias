import { useCallback, useEffect, useState } from 'react'
import {
  createContent,
  deleteContent,
  fetchContentsBySubmodule,
  fetchModulesWithSubmodules,
  updateContentPublished,
} from '../lib/contents'

export function useAdminContents() {
  const [modules, setModules] = useState([])
  const [selectedModuleId, setSelectedModuleId] = useState('')
  const [selectedSubmoduleId, setSelectedSubmoduleId] = useState('')
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [contentsLoading, setContentsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)

  const selectedModule = modules.find((module) => module.id === selectedModuleId) ?? null
  const submodules = selectedModule?.submodules ?? []
  const selectedSubmodule = submodules.find((item) => item.id === selectedSubmoduleId) ?? null

  const loadModules = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchModulesWithSubmodules()
      setModules(data)

      if (data.length > 0) {
        setSelectedModuleId((current) => current || data[0].id)
      }
    } catch (err) {
      setError(err.message ?? 'No se pudieron cargar los módulos')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadContents = useCallback(async (submoduleId) => {
    if (!submoduleId) {
      setContents([])
      return
    }

    setContentsLoading(true)
    setActionError(null)

    try {
      const data = await fetchContentsBySubmodule(submoduleId)
      setContents(data)
    } catch (err) {
      setActionError(err.message ?? 'No se pudo cargar el contenido')
    } finally {
      setContentsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadModules()
  }, [loadModules])

  useEffect(() => {
    if (!selectedModuleId) return

    const module = modules.find((item) => item.id === selectedModuleId)
    const firstSubmodule = module?.submodules?.[0]

    setSelectedSubmoduleId((current) => {
      const stillValid = module?.submodules?.some((item) => item.id === current)
      if (stillValid) return current
      return firstSubmodule?.id ?? ''
    })
  }, [selectedModuleId, modules])

  useEffect(() => {
    loadContents(selectedSubmoduleId)
  }, [selectedSubmoduleId, loadContents])

  async function handleCreateContent(payload) {
    setActionError(null)

    try {
      await createContent(payload)
      await loadContents(payload.submoduleId)
    } catch (err) {
      setActionError(err.message ?? 'No se pudo subir el contenido')
      throw err
    }
  }

  async function handleTogglePublished(contentId, isPublished) {
    setActionError(null)

    try {
      await updateContentPublished(contentId, isPublished)
      setContents((current) =>
        current.map((item) => (item.id === contentId ? { ...item, is_published: isPublished } : item)),
      )
    } catch (err) {
      setActionError(err.message ?? 'No se pudo actualizar la publicación')
    }
  }

  async function handleDelete(content) {
    setActionError(null)

    try {
      await deleteContent(content)
      setContents((current) => current.filter((item) => item.id !== content.id))
    } catch (err) {
      setActionError(err.message ?? 'No se pudo eliminar el contenido')
    }
  }

  return {
    modules,
    submodules,
    selectedModule,
    selectedSubmodule,
    selectedModuleId,
    setSelectedModuleId,
    selectedSubmoduleId,
    setSelectedSubmoduleId,
    contents,
    loading,
    contentsLoading,
    error,
    actionError,
    handleCreateContent,
    handleTogglePublished,
    handleDelete,
  }
}
