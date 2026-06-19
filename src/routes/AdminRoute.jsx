import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AdminRoute() {
  const { session, loading, isSuperAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-cream text-charcoal">
        Cargando...
      </div>
    )
  }

  if (!session || !isSuperAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
