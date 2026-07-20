import { useEffect, useState } from 'react'
import { slugify } from '../../lib/adminModules'

const inputClass =
  'mt-1 w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-terracotta'

const emptyForm = {
  title: '',
  description: '',
  slug: '',
  isPublished: true,
  sortOrder: 1,
}

export function ModuleForm({
  initialValues = null,
  submitLabel = 'Guardar módulo',
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(emptyForm)
  const [slugManual, setSlugManual] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title ?? '',
        description: initialValues.description ?? '',
        slug: initialValues.slug ?? '',
        isPublished: Boolean(initialValues.is_published),
        sortOrder: initialValues.sort_order ?? 1,
      })
      setSlugManual(true)
    } else {
      setForm(emptyForm)
      setSlugManual(false)
    }
  }, [initialValues])

  function updateField(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value }
      if (field === 'title' && !slugManual && !initialValues) {
        next.slug = slugify(value)
      }
      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      await onSubmit({
        title: form.title,
        description: form.description,
        slug: form.slug,
        isPublished: form.isPublished,
        sortOrder: form.sortOrder,
      })
      if (!initialValues) {
        setForm(emptyForm)
        setSlugManual(false)
      }
    } catch (err) {
      setFormError(err.message ?? 'No se pudo guardar el módulo')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-charcoal/10 bg-cream/40 p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-charcoal sm:col-span-2">
          Título
          <input
            type="text"
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            className={inputClass}
            placeholder="Ej. Asesoría de imagen"
            required
          />
        </label>

        <label className="block text-sm font-medium text-charcoal sm:col-span-2">
          Descripción
          <textarea
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            className={`${inputClass} min-h-24 resize-y`}
            placeholder="Resumen corto del módulo"
            rows={3}
          />
        </label>

        <label className={`block text-sm font-medium text-charcoal ${initialValues ? '' : 'sm:col-span-2'}`}>
          Slug (URL)
          <input
            type="text"
            value={form.slug}
            onChange={(event) => {
              setSlugManual(true)
              updateField('slug', slugify(event.target.value))
            }}
            className={inputClass}
            placeholder="asesoria-imagen"
            required
          />
        </label>

        {initialValues && (
          <label className="block text-sm font-medium text-charcoal">
            Orden
            <input
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(event) => updateField('sortOrder', event.target.value)}
              className={inputClass}
            />
          </label>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(event) => updateField('isPublished', event.target.checked)}
          className="rounded border-charcoal/25 text-terracotta focus:ring-terracotta"
        />
        Publicar en la página pública
      </label>

      {formError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-white transition hover:bg-terracotta-dark disabled:opacity-60"
        >
          {submitting ? 'Guardando...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:bg-cream"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
