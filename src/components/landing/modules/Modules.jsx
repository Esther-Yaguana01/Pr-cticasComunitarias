import { ModuleCard } from './ModuleCard'
import { usePublishedModules } from '../../../hooks/usePublishedModules'
import { getModuleColor } from '../../../utils/moduleTheme'

export function Modules() {
  const { modules, loading, error } = usePublishedModules()

  return (
    <section id="modules" className="mx-auto w-full min-w-0 max-w-6xl px-4 py-10 sm:px-8 sm:py-12">
      <h2 className="mb-6 font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
        Módulo de aprendizaje
      </h2>

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
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                title={module.title}
                description={module.description}
                videos={module.videoCount}
                pdfs={module.pdfCount}
                color={getModuleColor(module.slug)}
                slug={module.slug}
              />
            ))}
          </div>

          <div className="mt-10 rounded-[32px] border border-terracotta/10 bg-gradient-to-r from-[#f9eee6] via-[#fffaf4] to-[#f4e8db] p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-terracotta-dark">
                  Aprende a tu ritmo
                </p>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-charcoal">
                  ¿Qué encontrarás en cada módulo?
                </h3>
              </div>
              <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-charcoal/70">
                Contenido práctico
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {modules.map((module) => (
                <div
                  key={`${module.id}-detail`}
                  className="rounded-2xl bg-white/80 p-5 ring-1 ring-charcoal/5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-dark">
                    {module.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-charcoal/75">
                    {module.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
