import { Link, useParams } from 'react-router-dom'
import { SubmoduleContentPanel } from '../../components/modules/SubmoduleContentPanel'
import { SubmoduleTabs } from '../../components/modules/SubmoduleTabs'
import { useModuleDetail } from '../../hooks/useModuleDetail'
import { getModuleColor } from '../../utils/moduleTheme'

const MODULE_ACCENT = {
  rose: 'text-terracotta-dark',
  green: 'text-[#32684d]',
  amber: 'text-[#8a5d18]',
}

export function ModuleDetailPage() {
  const { slug } = useParams()
  const {
    module,
    submodules,
    activeSubmodule,
    activeContents,
    activeSubmoduleId,
    setActiveSubmoduleId,
    loading,
    error,
  } = useModuleDetail(slug)

  const accent = MODULE_ACCENT[getModuleColor(slug)] ?? MODULE_ACCENT.rose

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Link
        to="/modules"
        className="inline-flex items-center text-sm font-medium text-charcoal/60 transition-colors hover:text-charcoal"
      >
        ← Volver a módulos
      </Link>

      {loading && <p className="mt-8 text-sm text-charcoal/60">Cargando módulo...</p>}

      {error && (
        <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && module && (
        <>
          <div className="mt-6 max-w-3xl">
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent}`}>
              Módulo educativo
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal">{module.title}</h1>
            {module.description && (
              <p className="mt-3 text-base leading-relaxed text-charcoal/75">{module.description}</p>
            )}
          </div>

          {submodules.length === 0 ? (
            <p className="mt-10 text-sm text-charcoal/60">
              Este módulo aún no tiene submódulos publicados.
            </p>
          ) : (
            <div className="mt-10">
              <SubmoduleTabs
                submodules={submodules}
                activeId={activeSubmoduleId}
                onChange={setActiveSubmoduleId}
              />
              {activeSubmodule && (
                <div className="mt-0">
                  <p className="mb-4 px-1 text-sm text-charcoal/65">{activeSubmodule.title}</p>
                  <SubmoduleContentPanel contents={activeContents} />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}
