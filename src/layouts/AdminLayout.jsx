import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/admin', label: 'Panel', end: true },
  { to: '/admin/modules', label: 'Módulos' },
  { to: '/admin/contents', label: 'Contenido' },
  { to: '/admin/suggestions', label: 'Sugerencias' },
]

export function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-svh bg-cream text-charcoal">
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-5 py-6 sm:px-8 lg:flex-row">
        <aside className="lg:w-56">
          <p className="font-serif text-2xl font-semibold text-terracotta">Panel admin</p>
          <p className="mt-1 text-sm text-charcoal/70">Mujer en Acción</p>

          <nav className="mt-6 flex flex-row flex-wrap gap-2 lg:flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm no-underline transition-colors ${
                    isActive
                      ? 'bg-terracotta text-white'
                      : 'bg-white text-charcoal hover:bg-rose-light/40'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-6 rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm text-charcoal hover:bg-rose-light/30"
          >
            Cerrar sesión
          </button>
        </aside>

        <main className="flex-1 rounded-2xl border border-charcoal/8 bg-white p-6 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
