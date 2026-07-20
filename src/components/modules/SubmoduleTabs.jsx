export function SubmoduleTabs({ submodules, activeId, onChange }) {
  return (
    <div className="w-full min-w-0">
      {/* Móvil: selector apilado */}
      <label className="block md:hidden">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/55">
          Submódulo
        </span>
        <select
          value={activeId ?? ''}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-charcoal/15 bg-white px-4 py-3 text-sm font-medium text-charcoal outline-none transition focus:border-terracotta"
          aria-label="Seleccionar submódulo"
        >
          {submodules.map((submodule) => (
            <option key={submodule.id} value={submodule.id}>
              {submodule.title}
            </option>
          ))}
        </select>
      </label>

      {/* Tablet/desktop: tabs con scroll horizontal contenido */}
      <div className="hidden md:block">
        <div className="overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:thin]">
          <div
            className="flex w-max max-w-none gap-2 border-b border-charcoal/10"
            role="tablist"
            aria-label="Submódulos"
          >
            {submodules.map((submodule) => {
              const isActive = submodule.id === activeId

              return (
                <button
                  key={submodule.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onChange(submodule.id)}
                  className={`shrink-0 rounded-t-2xl px-4 py-3 text-left text-sm font-medium transition-colors sm:px-5 ${
                    isActive
                      ? 'border border-b-0 border-charcoal/10 bg-white text-terracotta-dark'
                      : 'text-charcoal/60 hover:bg-white/60 hover:text-charcoal'
                  }`}
                >
                  <span className="block max-w-[16rem] leading-snug whitespace-normal">
                    {submodule.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
