import { Link } from 'react-router-dom'

export function ModuleCard({ title, description, videos, color = 'rose', slug }) {
  const styles = {
    rose: {
      card: 'from-[#fff7f2] to-[#fff1e8] border-[#e9c4b4]',
      badge: 'bg-[#fff7f2] text-terracotta-dark',
      pill: 'bg-[#f8e3d6] text-charcoal/80',
      action: 'text-terracotta-dark',
    },
    green: {
      card: 'from-[#f7fbf7] to-[#eef7f1] border-[#c9dfcf]',
      badge: 'bg-[#f2f8f4] text-[#32684d]',
      pill: 'bg-[#e5f3e9] text-charcoal/80',
      action: 'text-[#32684d]',
    },
    amber: {
      card: 'from-[#fffaf1] to-[#fff4d9] border-[#edd4a7]',
      badge: 'bg-[#fff8e3] text-[#8a5d18]',
      pill: 'bg-[#fceec3] text-charcoal/80',
      action: 'text-[#8a5d18]',
    },
  }[color] || {
    card: 'from-white to-cream border-charcoal/10',
    badge: 'bg-white text-charcoal',
    pill: 'bg-white text-charcoal/80',
    action: 'text-charcoal',
  }

  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] border bg-gradient-to-br ${styles.card} p-6 shadow-[0_18px_40px_-28px_rgba(30,28,26,0.7)]`}
    >
      <span className="absolute right-5 top-5 h-12 w-12 rounded-2xl bg-white/45" aria-hidden="true" />
      <div className="relative">
        {videos != null && (
          <span className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${styles.badge}`}>
            {videos} videos
          </span>
        )}
        <h3 className={`font-serif text-2xl font-semibold text-charcoal ${videos != null ? 'mt-3' : ''}`}>{title}</h3>
        <p className="mt-2 text-sm leading-6 text-charcoal/75">{description}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles.pill}`}>Contenido práctico</span>
        {slug ? (
          <Link
            to={`/modules/${slug}`}
            className={`text-sm font-semibold no-underline transition-transform duration-200 group-hover:translate-x-0.5 ${styles.action}`}
          >
            Ver
          </Link>
        ) : (
          <button type="button" className={`text-sm font-semibold transition-transform duration-200 group-hover:translate-x-0.5 ${styles.action}`}>
            Ver
          </button>
        )}
      </div>
    </article>
  )
}
