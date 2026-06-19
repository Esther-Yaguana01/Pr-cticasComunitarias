export function ModuleCard({ title, description, videos, color = 'rose' }) {
  const colorBg = {
    rose: 'bg-rose-50 text-charcoal',
    green: 'bg-emerald-50 text-charcoal',
    amber: 'bg-amber-50 text-charcoal',
  }[color] || 'bg-white'

  return (
    <article className={`group flex flex-col justify-between rounded-2xl p-6 shadow-sm ${colorBg}`}>
      <div>
        <h3 className="mb-2 font-serif text-lg font-semibold">{title}</h3>
        <p className="text-sm text-charcoal/75">{description}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="rounded-full border border-charcoal/10 bg-white/60 px-3 py-1 text-xs font-medium">{videos} videos</span>
        <button className="text-sm font-medium text-rose-light opacity-0 transition-opacity group-hover:opacity-100">Ver</button>
      </div>
    </article>
  )
}
