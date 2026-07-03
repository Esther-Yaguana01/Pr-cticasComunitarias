import { Hero } from '../../components/landing/Hero'
import { StatsBar } from '../../components/landing/StatsBar'
import { Modules } from '../../components/landing/modules/Modules'

export function LandingPage() {
  return (
    <main>
      <Hero />
      <Modules />
      <StatsBar />
    </main>
  )
}
