import { useEffect, useState } from 'react'
import { fetchAdminDashboard } from '../lib/admin'

export function useAdminDashboard() {
  const [stats, setStats] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    fetchAdminDashboard()
      .then((data) => {
        if (!mounted) return
        setStats(data.stats)
        setModules(data.modules)
      })
      .catch((err) => {
        if (mounted) setError(err.message ?? 'No se pudo cargar el panel')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return { stats, modules, loading, error }
}
