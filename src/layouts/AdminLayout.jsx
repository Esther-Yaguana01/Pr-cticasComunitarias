import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/admin', label: 'Panel', end: true },
  { to: '/admin/modules', label: 'Módulos' },
  { to: '/admin/contents', label: 'Contenido' },
]

export function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-svh w-full min-w-0 overflow-x-clip bg-cream text-charcoal">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:gap-6 sm:px-8 sm:py-6 lg:flex-row">
        <aside className="shrink-0 lg:w-56">
          <p className="font-serif text-2xl font-semibold text-terracotta">Panel admin</p>
          <p className="mt-1 text-sm text-charcoal/70">Mujer en Acción</p>

          <nav className="mt-4 flex flex-row flex-wrap gap-2 sm:mt-6 lg:flex-col">
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
            className="mt-4 rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm text-charcoal hover:bg-rose-light/30 sm:mt-6"
          >
            Cerrar sesión
          </button>
        </aside>

        <main className="min-w-0 flex-1 rounded-2xl border border-charcoal/8 bg-white p-4 shadow-sm sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
