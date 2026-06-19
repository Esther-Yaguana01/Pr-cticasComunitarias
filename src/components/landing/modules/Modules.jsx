import { MODULES } from '../../../constants/landing'
import { ModuleCard } from './ModuleCard'

export function Modules() {
  return (
    <section id="modules" className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <h2 className="mb-6 font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
        Elige tu módulo de aprendizaje
      </h2>

      <div className="grid gap-5 sm:grid-cols-3">
        {MODULES.map((m) => (
          <ModuleCard
            key={m.id}
            title={m.title}
            description={m.description}
            videos={m.videos}
            color={m.color}
          />
        ))}
      </div>

      <div className="mt-10 rounded-[32px] border border-terracotta/10 bg-gradient-to-r from-[#f9eee6] via-[#fffaf4] to-[#f4e8db] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-terracotta-dark">
              Aprende a tu ritmo
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold text-charcoal">
              ¿Qué encontrarás en cada módulo?
            </h3>
          </div>
          <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-charcoal/70">
            Contenido práctico
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {MODULES.map((m) => (
            <div key={`${m.id}-detail`} className="rounded-2xl bg-white/80 p-5 ring-1 ring-charcoal/5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-dark">
                {m.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-charcoal/75">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
