import { Header } from '../components/layout/Header'
import { Hero } from '../components/landing/Hero'
import { StatsBar } from '../components/landing/StatsBar'
import { Modules } from '../components/landing/modules/Modules'

export function LandingPage() {
  return (
    <div className="min-h-svh bg-cream">
      <Header />
      <main>
        <Hero />
        <Modules />
        <StatsBar />
      </main>
    </div>
  )
}
