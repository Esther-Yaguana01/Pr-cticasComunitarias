import { Outlet } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

export function PublicLayout() {
  return (
    <div className="flex min-h-svh w-full min-w-0 flex-col overflow-x-clip bg-cream">
      <Header />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
