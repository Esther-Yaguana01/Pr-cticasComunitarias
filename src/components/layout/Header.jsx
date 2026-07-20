import { Link } from 'react-router-dom'
import { SITE_NAME } from '../../constants/landing'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/8 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center px-5 py-4 sm:px-8">
        <Link to="/" className="group flex items-baseline gap-1 no-underline">
          <span className="font-serif text-xl font-semibold text-terracotta transition-colors group-hover:text-terracotta-dark sm:text-2xl">
            {SITE_NAME.primary}
          </span>
          <span className="font-serif text-xl italic text-charcoal sm:text-2xl">
            {SITE_NAME.secondary}
          </span>
        </Link>
      </div>
    </header>
  )
}
