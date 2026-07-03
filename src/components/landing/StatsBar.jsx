import { STATS } from '../../constants/landing'

export function StatsBar() {
  return (
    <section className="bg-charcoal">
      <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center px-4 py-8 text-center sm:py-10"
          >
            <span className="font-serif text-3xl font-semibold text-rose-light sm:text-4xl">
              {stat.value}
            </span>
            <span className="mt-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/55 sm:text-xs">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
