import { Outlet } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
