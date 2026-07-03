import { Link } from 'react-router-dom'
import { getModuleColor } from '../../utils/moduleTheme'

const MODULE_STYLES = {
  rose: {
    card: 'from-[#fff7f2] to-[#fff1e8] border-[#e9c4b4]',
    badge: 'bg-white/80 text-terracotta-dark',
    bar: 'bg-terracotta',
  },
  green: {
    card: 'from-[#f7fbf7] to-[#eef7f1] border-[#c9dfcf]',
    badge: 'bg-white/80 text-[#32684d]',
    bar: 'bg-[#32684d]',
  },
  amber: {
    card: 'from-[#fffaf1] to-[#fff4d9] border-[#edd4a7]',
    badge: 'bg-white/80 text-[#8a5d18]',
    bar: 'bg-[#8a5d18]',
  },
}

export function ModuleOverviewCard({ module }) {
  const color = getModuleColor(module.slug)
  const styles = MODULE_STYLES[color] ?? MODULE_STYLES.rose
  const contentTotal = Math.max(module.pdfCount + module.videoCount, 1)
  const pdfPct = Math.round((module.pdfCount / contentTotal) * 100)
  const videoPct = Math.round((module.videoCount / contentTotal) * 100)

  return (
    <article className={`rounded-[28px] border bg-gradient-to-br p-5 ${styles.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-charcoal/50">
            Módulo {module.sort_order}
          </p>
          <h3 className="mt-1 font-serif text-2xl font-semibold text-charcoal">{module.title}</h3>
          <p className="mt-2 text-sm leading-6 text-charcoal/70">{module.description}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            module.is_published ? styles.badge : 'bg-charcoal/10 text-charcoal/60'
          }`}
        >
          {module.is_published ? 'Publicado' : 'Borrador'}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/70 px-3 py-3 text-center">
          <p className="font-serif text-2xl font-semibold text-charcoal">{module.publishedSubmoduleCount}</p>
          <p className="text-xs text-charcoal/60">Submódulos</p>
        </div>
        <div className="rounded-2xl bg-white/70 px-3 py-3 text-center">
          <p className="font-serif text-2xl font-semibold text-charcoal">{module.pdfCount}</p>
          <p className="text-xs text-charcoal/60">PDFs</p>
        </div>
        <div className="rounded-2xl bg-white/70 px-3 py-3 text-center">
          <p className="font-serif text-2xl font-semibold text-charcoal">{module.videoCount}</p>
          <p className="text-xs text-charcoal/60">Videos</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex justify-between text-xs text-charcoal/60">
          <span>Contenido publicado</span>
          <span>{module.publishedContentCount} archivos</span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-white/80">
          {module.pdfCount > 0 && (
            <span className={`${styles.bar} opacity-80`} style={{ width: `${pdfPct}%` }} title="PDFs" />
          )}
          {module.videoCount > 0 && (
            <span className={`${styles.bar}`} style={{ width: `${videoPct}%` }} title="Videos" />
          )}
          {module.publishedContentCount === 0 && (
            <span className="w-full bg-charcoal/10" />
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to={`/modules/${module.slug}`}
          className="rounded-full border border-charcoal/15 bg-white px-4 py-2 text-sm font-medium text-charcoal no-underline transition-colors hover:bg-cream"
        >
          Ver público
        </Link>
        <Link
          to="/admin/contents"
          className="rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-white no-underline transition-opacity hover:opacity-90"
        >
          Gestionar contenido
        </Link>
      </div>
    </article>
  )
}
