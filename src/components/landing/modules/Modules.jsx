import { MODULES } from '../../../constants/landing'
import { ModuleCard } from './ModuleCard'

export function Modules() {
  return (
    <section id="modules" className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <h2 className="mb-6 font-serif text-2xl font-semibold text-charcoal">Elige tu módulo de aprendizaje</h2>

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
    </section>
  )
}
