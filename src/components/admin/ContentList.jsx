function TypeBadge({ type }) {
  const styles =
    type === 'pdf'
      ? 'bg-terracotta/10 text-terracotta-dark'
      : 'bg-emerald-100 text-emerald-800'

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${styles}`}>
      {type}
    </span>
  )
}

export function ContentList({
  contents,
  loading,
  onTogglePublished,
  onDelete,
}) {
  if (loading) {
    return <p className="text-sm text-charcoal/60">Cargando contenido...</p>
  }

  if (contents.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-charcoal/15 px-4 py-8 text-center text-sm text-charcoal/60">
        Aún no hay PDFs ni videos en este submódulo.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {contents.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-4 rounded-2xl border border-charcoal/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={item.type} />
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  item.is_published
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-charcoal/10 text-charcoal/60'
                }`}
              >
                {item.is_published ? 'Publicado' : 'Borrador'}
              </span>
            </div>
            <p className="mt-2 font-medium text-charcoal">{item.title}</p>
            {item.body && <p className="mt-1 text-sm text-charcoal/65">{item.body}</p>}
            {item.file_url && (
              <a
                href={item.file_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-terracotta-dark hover:underline"
              >
                Ver archivo →
              </a>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onTogglePublished(item.id, !item.is_published)}
              className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:bg-cream"
            >
              {item.is_published ? 'Ocultar' : 'Publicar'}
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
