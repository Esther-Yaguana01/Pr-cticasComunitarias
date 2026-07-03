import { useEffect, useState } from 'react'
import { fetchPublishedModules } from '../lib/modules'

export function usePublishedModules() {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    fetchPublishedModules()
      .then((data) => {
        if (mounted) setModules(data)
      })
      .catch((err) => {
        if (mounted) setError(err.message ?? 'No se pudieron cargar los módulos')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return { modules, loading, error }
}
