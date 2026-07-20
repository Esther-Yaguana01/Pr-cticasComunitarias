import { Link } from 'react-router-dom'
import { ModuleOverviewCard } from '../../components/admin/ModuleOverviewCard'
import { StatCard } from '../../components/admin/StatCard'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import { useAuth } from '../../hooks/useAuth'

export function AdminDashboardPage() {
  const { profile } = useAuth()
  const { stats, modules, loading, error } = useAdminDashboard()

  const greeting = profile?.full_name ? `Hola, ${profile.full_name.split(' ')[0]}` : 'Panel principal'

  return (
    <div className="space-y-8">
      <header className="rounded-[24px] border border-terracotta/15 bg-gradient-to-r from-[#f9eee6] via-white to-[#f4e8db] p-5 sm:rounded-[28px] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta-dark">
          Mujer en Acción · Admin
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">{greeting}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-charcoal/75">
          Resumen del proyecto: módulos educativos, contenido publicado y actividad de las beneficiarias.
        </p>
      </header>

      {loading && <p className="text-sm text-charcoal/60">Cargando estadísticas...</p>}

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {stats && (
        <>
          <section>
            <div className="mb-4">
              <h2 className="font-serif text-2xl font-semibold text-charcoal">Estadísticas generales</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                label="Módulos"
                value={stats.modulesPublished}
                hint={`${stats.modulesTotal} en total · ${stats.submodulesPublished} submódulos`}
                accent="terracotta"
              />
              <StatCard
                label="Contenido"
                value={stats.contentsPublished}
                hint={`${stats.pdfCount} PDF · ${stats.videoCount} videos`}
                accent="green"
              />
              <StatCard
                label="Beneficiarias"
                value={stats.caregiversTotal}
                hint="Cuidadoras registradas"
                accent="amber"
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-charcoal/8 bg-cream/50 p-5 sm:p-6">
            <h3 className="font-serif text-xl font-semibold text-charcoal">Distribución de contenido</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm text-charcoal/60">Submódulos activos</p>
                <p className="mt-1 font-serif text-3xl font-semibold text-charcoal">{stats.submodulesPublished}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm text-charcoal/60">Guías PDF</p>
                <p className="mt-1 font-serif text-3xl font-semibold text-terracotta-dark">{stats.pdfCount}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm text-charcoal/60">Videos</p>
                <p className="mt-1 font-serif text-3xl font-semibold text-[#32684d]">{stats.videoCount}</p>
              </div>
            </div>
          </section>
        </>
      )}

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-charcoal">Módulos del proyecto</h2>
            <p className="mt-1 text-sm text-charcoal/65">
              Estado actual de los 3 módulos educativos y su contenido.
            </p>
          </div>
          <Link
            to="/admin/modules"
            className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal no-underline hover:bg-cream"
          >
            Gestionar módulos
          </Link>
        </div>

        {!loading && modules.length === 0 && (
          <p className="text-sm text-charcoal/60">No hay módulos registrados.</p>
        )}

        <div className="grid gap-5 xl:grid-cols-2">
          {modules.map((module) => (
            <ModuleOverviewCard key={module.id} module={module} />
          ))}
        </div>
      </section>
    </div>
  )
}
