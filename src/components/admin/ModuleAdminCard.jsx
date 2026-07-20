import { useState } from 'react'
import { ModuleForm } from './ModuleForm'
import { SubmoduleManager } from './SubmoduleManager'

export function ModuleAdminCard({
  module,
  onUpdate,
  onTogglePublished,
  onDelete,
  onCreateSubmodule,
  onUpdateSubmodule,
  onToggleSubmodulePublished,
  onDeleteSubmodule,
}) {
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Eliminar el módulo "${module.title}"? También se eliminarán sus submódulos y contenidos asociados.`,
    )
    if (!confirmed) return
    await onDelete(module.id)
  }

  return (
    <article className="min-w-0 rounded-2xl border border-charcoal/10 bg-white p-4 shadow-sm sm:p-5">
      {editing ? (
        <ModuleForm
          initialValues={module}
          submitLabel="Guardar cambios"
          onSubmit={async (payload) => {
            await onUpdate(module.id, payload)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-charcoal/50">
                  Orden {module.sort_order}
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    module.is_published
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-charcoal/10 text-charcoal/60'
                  }`}
                >
                  {module.is_published ? 'Publicado' : 'Borrador'}
                </span>
              </div>
              <h3 className="mt-2 font-serif text-xl font-semibold break-words text-charcoal sm:text-2xl">{module.title}</h3>
              {module.description && (
                <p className="mt-2 text-sm leading-6 break-words text-charcoal/70">{module.description}</p>
              )}
              <p className="mt-2 text-xs break-all text-charcoal/50">
                /modules/{module.slug} · {module.submodules.length} submódulo
                {module.submodules.length === 1 ? '' : 's'}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onTogglePublished(module.id, !module.is_published)}
                className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:bg-cream"
              >
                {module.is_published ? 'Ocultar' : 'Publicar'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:bg-cream"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:bg-cream"
            >
              {expanded ? 'Ocultar submódulos' : 'Gestionar submódulos'}
            </button>
          </div>

          {expanded && (
            <SubmoduleManager
              module={module}
              onCreate={(payload) => onCreateSubmodule(module.id, payload)}
              onUpdate={(submoduleId, payload) =>
                onUpdateSubmodule(module.id, submoduleId, payload)
              }
              onTogglePublished={(submoduleId, isPublished) =>
                onToggleSubmodulePublished(module.id, submoduleId, isPublished)
              }
              onDelete={(submoduleId) => onDeleteSubmodule(module.id, submoduleId)}
            />
          )}
        </>
      )}
    </article>
  )
}
