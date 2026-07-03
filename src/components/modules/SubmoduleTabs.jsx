export function SubmoduleTabs({ submodules, activeId, onChange }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2 border-b border-charcoal/10" role="tablist" aria-label="Submódulos">
        {submodules.map((submodule) => {
          const isActive = submodule.id === activeId

          return (
            <button
              key={submodule.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(submodule.id)}
              className={`rounded-t-2xl px-4 py-3 text-left text-sm font-medium transition-colors sm:px-5 ${
                isActive
                  ? 'border border-b-0 border-charcoal/10 bg-white text-terracotta-dark'
                  : 'text-charcoal/60 hover:bg-white/60 hover:text-charcoal'
              }`}
            >
              <span className="block max-w-[220px] leading-snug sm:max-w-none">{submodule.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
