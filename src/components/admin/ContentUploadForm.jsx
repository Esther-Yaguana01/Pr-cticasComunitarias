import { useState } from 'react'

const inputClass =
  'mt-1 w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-terracotta'

export function ContentUploadForm({
  module,
  submodule,
  onSubmit,
}) {
  const [type, setType] = useState('pdf')
  const [videoMode, setVideoMode] = useState('file')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [file, setFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  if (!module || !submodule) {
    return (
      <p className="rounded-2xl border border-dashed border-charcoal/15 px-4 py-8 text-center text-sm text-charcoal/60">
        Selecciona un módulo y submódulo para subir contenido.
      </p>
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError(null)

    if (!title.trim()) {
      setFormError('El título es obligatorio.')
      return
    }

    if (type === 'pdf' && !file) {
      setFormError('Selecciona un archivo PDF.')
      return
    }

    if (type === 'video' && videoMode === 'file' && !file) {
      setFormError('Selecciona un archivo de video.')
      return
    }

    if (type === 'video' && videoMode === 'url' && !videoUrl.trim()) {
      setFormError('Ingresa la URL del video (YouTube).')
      return
    }

    setSubmitting(true)

    try {
      await onSubmit({
        moduleId: module.id,
        submoduleId: submodule.id,
        moduleSlug: module.slug,
        submoduleSlug: submodule.slug,
        type,
        title: title.trim(),
        body,
        file: type === 'pdf' || (type === 'video' && videoMode === 'file') ? file : null,
        fileUrl: type === 'video' && videoMode === 'url' ? videoUrl : null,
        isPublished,
      })

      setTitle('')
      setBody('')
      setFile(null)
      setVideoUrl('')
      setIsPublished(true)
    } catch (err) {
      setFormError(err.message ?? 'No se pudo subir el contenido')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-charcoal/10 bg-gradient-to-br from-white to-cream p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-dark">
          Subir contenido
        </p>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-charcoal">
          {submodule.title}
        </h2>
        <p className="mt-1 text-sm text-charcoal/65">{module.title}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-charcoal">
          Tipo
          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value)
              setFile(null)
              setVideoUrl('')
            }}
            className={inputClass}
          >
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
          </select>
        </label>

        {type === 'video' && (
          <label className="block text-sm font-medium text-charcoal">
            Origen del video
            <select
              value={videoMode}
              onChange={(event) => {
                setVideoMode(event.target.value)
                setFile(null)
                setVideoUrl('')
              }}
              className={inputClass}
            >
              <option value="file">Subir archivo (MP4, WebM)</option>
              <option value="url">URL de YouTube</option>
            </select>
          </label>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-charcoal sm:col-span-2">
          Título
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej. Guía de colorimetría básica"
            className={inputClass}
            required
          />
        </label>

        <label className="block text-sm font-medium text-charcoal sm:col-span-2">
          Descripción (opcional)
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            placeholder="Breve descripción del material"
            className={inputClass}
          />
        </label>

        {type === 'pdf' && (
          <label className="block text-sm font-medium text-charcoal sm:col-span-2">
            Archivo PDF
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-terracotta/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-terracotta-dark`}
              required
            />
          </label>
        )}

        {type === 'video' && videoMode === 'file' && (
          <label className="block text-sm font-medium text-charcoal sm:col-span-2">
            Archivo de video
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/ogg,.mp4,.webm,.mov"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-terracotta/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-terracotta-dark`}
              required
            />
          </label>
        )}

        {type === 'video' && videoMode === 'url' && (
          <label className="block text-sm font-medium text-charcoal sm:col-span-2">
            URL de YouTube
            <input
              type="url"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={inputClass}
            />
          </label>
        )}
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(event) => setIsPublished(event.target.checked)}
          className="h-4 w-4 rounded border-charcoal/20 text-terracotta focus:ring-terracotta"
        />
        Publicar inmediatamente (visible para todas las visitantes)
      </label>

      {formError && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Subiendo...' : type === 'pdf' ? 'Subir PDF' : 'Subir video'}
      </button>
    </form>
  )
}
