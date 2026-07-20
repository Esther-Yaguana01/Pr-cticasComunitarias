import { Link } from 'react-router-dom'
import {
  HERO_DESCRIPTION,
  HERO_TAG,
  HERO_TITLE,
} from '../../constants/landing'
import { Button } from '../ui/Button'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-terracotta-dark via-terracotta to-terracotta-light px-4 py-12 sm:px-8 sm:py-20">
      {/* Decoración orgánica */}
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/8 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-charcoal/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-8 top-1/3 h-32 w-32 rotate-12 rounded-[40%] bg-white/5"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        <span className="mb-6 inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm sm:text-xs">
          {HERO_TAG}
        </span>

        <h1 className="mb-5 max-w-xl font-serif text-[2.25rem] font-semibold leading-[1.12] text-white sm:text-5xl sm:leading-tight lg:text-[3.25rem]">
          {HERO_TITLE.before}{' '}
          <em className="italic text-rose-light">{HERO_TITLE.emphasis}</em>
          <br className="hidden sm:block" />
          {' '}{HERO_TITLE.after}
        </h1>

        <p className="mb-8 max-w-md text-[0.95rem] leading-relaxed text-white/85 sm:text-base">
          {HERO_DESCRIPTION}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link to="/modules" className="no-underline">
            <Button variant="solid">Ver módulos</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
