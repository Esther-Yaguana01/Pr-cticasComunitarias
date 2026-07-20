import { useState } from 'react'
import { ModuleAdminCard } from '../../components/admin/ModuleAdminCard'
import { ModuleForm } from '../../components/admin/ModuleForm'
import { useAdminModules } from '../../hooks/useAdminModules'

export function AdminModulesPage() {
  const {
    modules,
    loading,
    error,
    actionError,
    handleCreateModule,
    handleUpdateModule,
    handleToggleModulePublished,
    handleDeleteModule,
    handleCreateSubmodule,
    handleUpdateSubmodule,
    handleToggleSubmodulePublished,
    handleDeleteSubmodule,
  } = useAdminModules()

  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal sm:text-3xl">Gestión de módulos</h1>
          <p className="mt-3 max-w-2xl text-charcoal/75">
            Crea, edita, publica y organiza los módulos educativos y sus submódulos (tabs).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm((current) => !current)}
          className="rounded-full bg-terracotta px-4 py-2.5 text-sm font-medium text-white transition hover:bg-terracotta-dark"
        >
          {showCreateForm ? 'Cerrar formulario' : 'Nuevo módulo'}
        </button>
      </header>

      {showCreateForm && (
        <section>
          <h2 className="mb-3 font-serif text-xl font-semibold text-charcoal">Crear módulo</h2>
          <ModuleForm
            submitLabel="Crear módulo"
            onSubmit={async (payload) => {
              await handleCreateModule(payload)
              setShowCreateForm(false)
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </section>
      )}

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

      {!loading && !error && modules.length === 0 && (
        <p className="rounded-2xl border border-dashed border-charcoal/15 px-4 py-10 text-center text-sm text-charcoal/60">
          Aún no hay módulos. Crea el primero para empezar.
        </p>
      )}

      {!loading && modules.length > 0 && (
        <section className="space-y-4">
          {modules.map((module) => (
            <ModuleAdminCard
              key={module.id}
              module={module}
              onUpdate={handleUpdateModule}
              onTogglePublished={handleToggleModulePublished}
              onDelete={handleDeleteModule}
              onCreateSubmodule={handleCreateSubmodule}
              onUpdateSubmodule={handleUpdateSubmodule}
              onToggleSubmodulePublished={handleToggleSubmodulePublished}
              onDeleteSubmodule={handleDeleteSubmodule}
            />
          ))}
        </section>
      )}
    </div>
  )
}
