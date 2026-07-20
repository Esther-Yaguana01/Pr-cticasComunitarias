import { useCallback, useEffect, useState } from 'react'
import {
  createModule,
  createSubmodule,
  deleteModule,
  deleteSubmodule,
  fetchAdminModules,
  updateModule,
  updateModulePublished,
  updateSubmodule,
  updateSubmodulePublished,
} from '../lib/adminModules'

export function useAdminModules() {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)

  const loadModules = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchAdminModules()
      setModules(data)
    } catch (err) {
      setError(err.message ?? 'No se pudieron cargar los módulos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadModules()
  }, [loadModules])

  async function runAction(action) {
    setActionError(null)
    try {
      await action()
    } catch (err) {
      setActionError(err.message ?? 'No se pudo completar la acción')
      throw err
    }
  }

  async function handleCreateModule(payload) {
    await runAction(async () => {
      const created = await createModule(payload)
      setModules((current) => [...current, created].sort((a, b) => a.sort_order - b.sort_order))
    })
  }

  async function handleUpdateModule(moduleId, payload) {
    await runAction(async () => {
      const updated = await updateModule(moduleId, payload)
      setModules((current) =>
        current
          .map((module) =>
            module.id === moduleId ? { ...module, ...updated } : module,
          )
          .sort((a, b) => a.sort_order - b.sort_order),
      )
    })
  }

  async function handleToggleModulePublished(moduleId, isPublished) {
    await runAction(async () => {
      await updateModulePublished(moduleId, isPublished)
      setModules((current) =>
        current.map((module) =>
          module.id === moduleId ? { ...module, is_published: isPublished } : module,
        ),
      )
    })
  }

  async function handleDeleteModule(moduleId) {
    await runAction(async () => {
      await deleteModule(moduleId)
      setModules((current) => current.filter((module) => module.id !== moduleId))
    })
  }

  async function handleCreateSubmodule(moduleId, payload) {
    await runAction(async () => {
      const created = await createSubmodule({ moduleId, ...payload })
      setModules((current) =>
        current.map((module) => {
          if (module.id !== moduleId) return module
          return {
            ...module,
            submodules: [...module.submodules, created].sort(
              (a, b) => a.sort_order - b.sort_order,
            ),
          }
        }),
      )
    })
  }

  async function handleUpdateSubmodule(moduleId, submoduleId, payload) {
    await runAction(async () => {
      const updated = await updateSubmodule(submoduleId, payload)
      setModules((current) =>
        current.map((module) => {
          if (module.id !== moduleId) return module
          return {
            ...module,
            submodules: module.submodules
              .map((item) => (item.id === submoduleId ? updated : item))
              .sort((a, b) => a.sort_order - b.sort_order),
          }
        }),
      )
    })
  }

  async function handleToggleSubmodulePublished(moduleId, submoduleId, isPublished) {
    await runAction(async () => {
      await updateSubmodulePublished(submoduleId, isPublished)
      setModules((current) =>
        current.map((module) => {
          if (module.id !== moduleId) return module
          return {
            ...module,
            submodules: module.submodules.map((item) =>
              item.id === submoduleId ? { ...item, is_published: isPublished } : item,
            ),
          }
        }),
      )
    })
  }

  async function handleDeleteSubmodule(moduleId, submoduleId) {
    await runAction(async () => {
      await deleteSubmodule(submoduleId)
      setModules((current) =>
        current.map((module) => {
          if (module.id !== moduleId) return module
          return {
            ...module,
            submodules: module.submodules.filter((item) => item.id !== submoduleId),
          }
        }),
      )
    })
  }

  return {
    modules,
    loading,
    error,
    actionError,
    handleCreateModule,
    handleUpdateModule,
    handleToggleModulePublished,
    handleDeleteModule,
    handleCreateSubmodule,
    handleUpdateSubmodule,
    handleToggleSubmodulePublished,
    handleDeleteSubmodule,
  }
}
