import { useEffect, useState } from 'react'
import { slugify } from '../../lib/adminModules'

const inputClass =
  'mt-1 w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-terracotta'

export function SubmoduleManager({
  module,
  onCreate,
  onUpdate,
  onTogglePublished,
  onDelete,
}) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    slug: '',
    isPublished: true,
    sortOrder: 1,
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    setEditingId(null)
    setFormError(null)
  }, [module.id])

  async function handleCreate(event) {
    event.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      await onCreate({
        title,
        slug: slug || slugify(title),
        isPublished,
      })
      setTitle('')
      setSlug('')
      setSlugManual(false)
      setIsPublished(true)
    } catch (err) {
      setFormError(err.message ?? 'No se pudo crear el submódulo')
    } finally {
      setSubmitting(false)
    }
  }

  function startEdit(submodule) {
    setEditingId(submodule.id)
    setEditForm({
      title: submodule.title,
      slug: submodule.slug,
      isPublished: submodule.is_published,
      sortOrder: submodule.sort_order,
    })
    setFormError(null)
  }

  async function handleUpdate(event) {
    event.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      await onUpdate(editingId, editForm)
      setEditingId(null)
    } catch (err) {
      setFormError(err.message ?? 'No se pudo actualizar el submódulo')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(submodule) {
    const confirmed = window.confirm(
      `¿Eliminar el submódulo "${submodule.title}"? Su contenido quedará sin tab asignado.`,
    )
    if (!confirmed) return

    try {
      await onDelete(submodule.id)
    } catch {
      // El error se muestra desde el hook padre
    }
  }

  return (
    <div className="mt-5 space-y-4 border-t border-charcoal/8 pt-5">
      <div>
        <h4 className="font-serif text-lg font-semibold text-charcoal">Submódulos (tabs)</h4>
        <p className="mt-1 text-sm text-charcoal/65">
          Organiza el contenido de este módulo. Luego súbelo en Contenido.
        </p>
      </div>

      {module.submodules.length === 0 ? (
        <p className="rounded-xl border border-dashed border-charcoal/15 px-4 py-5 text-center text-sm text-charcoal/60">
          Aún no hay submódulos en este módulo.
        </p>
      ) : (
        <ul className="space-y-2">
          {module.submodules.map((submodule) => (
            <li
              key={submodule.id}
              className="rounded-xl border border-charcoal/10 bg-white px-4 py-3"
            >
              {editingId === submodule.id ? (
                <form onSubmit={handleUpdate} className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-charcoal">
                      Título
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(event) =>
                          setEditForm((current) => ({ ...current, title: event.target.value }))
                        }
                        className={inputClass}
                        required
                      />
                    </label>
                    <label className="block text-sm font-medium text-charcoal">
                      Slug
                      <input
                        type="text"
                        value={editForm.slug}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            slug: slugify(event.target.value),
                          }))
                        }
                        className={inputClass}
                        required
                      />
                    </label>
                    <label className="block text-sm font-medium text-charcoal">
                      Orden
                      <input
                        type="number"
                        min={0}
                        value={editForm.sortOrder}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            sortOrder: event.target.value,
                          }))
                        }
                        className={inputClass}
                      />
                    </label>
                    <label className="flex items-end gap-2 pb-2 text-sm text-charcoal">
                      <input
                        type="checkbox"
                        checked={editForm.isPublished}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            isPublished: event.target.checked,
                          }))
                        }
                        className="rounded border-charcoal/25 text-terracotta focus:ring-terracotta"
                      />
                      Publicado
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-terracotta px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-full border border-charcoal/15 px-3 py-1.5 text-sm font-medium text-charcoal"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-charcoal">{submodule.title}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          submodule.is_published
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-charcoal/10 text-charcoal/60'
                        }`}
                      >
                        {submodule.is_published ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-charcoal/55">
                      /{submodule.slug} · orden {submodule.sort_order}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onTogglePublished(submodule.id, !submodule.is_published)}
                      className="rounded-full border border-charcoal/15 px-3 py-1.5 text-sm font-medium text-charcoal hover:bg-cream"
                    >
                      {submodule.is_published ? 'Ocultar' : 'Publicar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(submodule)}
                      className="rounded-full border border-charcoal/15 px-3 py-1.5 text-sm font-medium text-charcoal hover:bg-cream"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(submodule)}
                      className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleCreate}
        className="space-y-3 rounded-xl border border-dashed border-charcoal/15 bg-cream/30 p-4"
      >
        <p className="text-sm font-medium text-charcoal">Nuevo submódulo</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-charcoal">
            Título
            <input
              type="text"
              value={title}
              onChange={(event) => {
                const value = event.target.value
                setTitle(value)
                if (!slugManual) setSlug(slugify(value))
              }}
              className={inputClass}
              placeholder="Ej. Colorimetría"
              required
            />
          </label>
          <label className="block text-sm text-charcoal">
            Slug
            <input
              type="text"
              value={slug}
              onChange={(event) => {
                setSlugManual(true)
                setSlug(slugify(event.target.value))
              }}
              className={inputClass}
              placeholder="colorimetria"
              required
            />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(event) => setIsPublished(event.target.checked)}
            className="rounded border-charcoal/25 text-terracotta focus:ring-terracotta"
          />
          Publicar submódulo
        </label>
        {formError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? 'Agregando...' : 'Agregar submódulo'}
        </button>
      </form>
    </div>
  )
}
