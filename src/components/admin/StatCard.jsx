export function StatCard({ label, value, hint, accent = 'terracotta' }) {
  const accents = {
    terracotta: 'from-terracotta/15 to-rose-light/30 border-terracotta/20 text-terracotta-dark',
    green: 'from-emerald-50 to-emerald-100/60 border-emerald-200 text-emerald-800',
    amber: 'from-amber-50 to-amber-100/60 border-amber-200 text-amber-900',
    slate: 'from-charcoal/5 to-charcoal/10 border-charcoal/10 text-charcoal',
  }

  return (
    <article
      className={`rounded-2xl border bg-gradient-to-br p-5 ${accents[accent] ?? accents.terracotta}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{label}</p>
      <p className="mt-2 font-serif text-4xl font-semibold">{value}</p>
      {hint && <p className="mt-2 text-sm opacity-75">{hint}</p>}
    </article>
  )
}
