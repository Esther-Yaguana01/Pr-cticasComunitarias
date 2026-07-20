import { ModuleCard } from '../../components/landing/modules/ModuleCard'
import { usePublishedModules } from '../../hooks/usePublishedModules'
import { getModuleColor } from '../../utils/moduleTheme'

export function ModulesPage() {
  const { modules, loading, error } = usePublishedModules()

  return (
    <section className="mx-auto w-full min-w-0 max-w-6xl px-4 py-10 sm:px-8 sm:py-12">
      <div className="mb-8 max-w-2xl min-w-0">
        <h1 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">Módulos educativos</h1>
        <p className="mt-4 text-base leading-relaxed text-charcoal/75">
          Explora los módulos publicados. Videos, guías y materiales disponibles sin iniciar sesión.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-charcoal/60">Cargando módulos...</p>
      )}

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && modules.length === 0 && (
        <p className="text-sm text-charcoal/60">Aún no hay módulos publicados.</p>
      )}

      {!loading && !error && modules.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              videos={module.videoCount}
              pdfs={module.pdfCount}
              slug={module.slug}
              color={getModuleColor(module.slug)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
