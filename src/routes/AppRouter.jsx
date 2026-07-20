import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminContentsPage } from '../pages/admin/AdminContentsPage'
import { AdminLoginPage } from '../pages/admin/AdminLoginPage'
import { AdminModulesPage } from '../pages/admin/AdminModulesPage'
import { LandingPage } from '../pages/public/LandingPage'
import { ModuleDetailPage } from '../pages/public/ModuleDetailPage'
import { ModulesPage } from '../pages/public/ModulesPage'
import { AdminRoute } from './AdminRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/:slug" element={<ModuleDetailPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/modules" element={<AdminModulesPage />} />
            <Route path="/admin/contents" element={<AdminContentsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
