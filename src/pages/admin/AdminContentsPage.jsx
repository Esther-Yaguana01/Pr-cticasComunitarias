import { ContentList } from '../../components/admin/ContentList'
import { ContentUploadForm } from '../../components/admin/ContentUploadForm'
import { useAdminContents } from '../../hooks/useAdminContents'

const selectClass =
  'mt-1 w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-terracotta'

export function AdminContentsPage() {
  const {
    modules,
    submodules,
    selectedModule,
    selectedSubmodule,
    selectedModuleId,
    setSelectedModuleId,
    selectedSubmoduleId,
    setSelectedSubmoduleId,
    contents,
    loading,
    contentsLoading,
    error,
    actionError,
    handleCreateContent,
    handleTogglePublished,
    handleDelete,
  } = useAdminContents()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-3xl font-semibold text-charcoal">Gestión de contenido</h1>
        <p className="mt-3 max-w-2xl text-charcoal/75">
          Sube PDFs y videos a cada submódulo. El contenido publicado aparecerá automáticamente en la
          vista pública del módulo.
        </p>
      </header>

      {loading && <p className="text-sm text-charcoal/60">Cargando módulos...</p>}

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {actionError && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </p>
      )}

      {!loading && modules.length > 0 && (
        <>
          <section className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-charcoal">
              Módulo
              <select
                value={selectedModuleId}
                onChange={(event) => setSelectedModuleId(event.target.value)}
                className={selectClass}
              >
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-charcoal">
              Submódulo (tab)
              <select
                value={selectedSubmoduleId}
                onChange={(event) => setSelectedSubmoduleId(event.target.value)}
                className={selectClass}
                disabled={submodules.length === 0}
              >
                {submodules.map((submodule) => (
                  <option key={submodule.id} value={submodule.id}>
                    {submodule.title}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <ContentUploadForm
            module={selectedModule}
            submodule={selectedSubmodule}
            onSubmit={handleCreateContent}
          />

          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-charcoal">Contenido actual</h2>
                <p className="mt-1 text-sm text-charcoal/65">
                  {selectedSubmodule
                    ? `Archivos en "${selectedSubmodule.title}"`
                    : 'Selecciona un submódulo'}
                </p>
              </div>
              {selectedModule && (
                <a
                  href={`/modules/${selectedModule.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal no-underline hover:bg-cream"
                >
                  Vista pública ↗
                </a>
              )}
            </div>

            <ContentList
              contents={contents}
              loading={contentsLoading}
              onTogglePublished={handleTogglePublished}
              onDelete={handleDelete}
            />
          </section>
        </>
      )}
    </div>
  )
}
