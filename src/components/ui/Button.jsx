const variants = {
  outline: 'border border-charcoal/25 bg-transparent text-charcoal hover:bg-charcoal/5',
  outlineLight:
    'border border-white/50 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm',
  solid: 'border border-transparent bg-cream text-charcoal hover:bg-white shadow-sm',
}

export function Button({ variant = 'outline', className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
