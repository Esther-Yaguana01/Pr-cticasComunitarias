import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function CaregiverRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-cream text-charcoal">
        Cargando...
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/register" replace />
  }

  return <Outlet />
}
