import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminContentsPage } from '../pages/admin/AdminContentsPage'
import { AdminLoginPage } from '../pages/admin/AdminLoginPage'
import { AdminModulesPage } from '../pages/admin/AdminModulesPage'
import { AdminSuggestionsPage } from '../pages/admin/AdminSuggestionsPage'
import { LandingPage } from '../pages/public/LandingPage'
import { ModulesPage } from '../pages/public/ModulesPage'
import { ProgressPage } from '../pages/public/ProgressPage'
import { RegisterPage } from '../pages/public/RegisterPage'
import { SuggestionsPage } from '../pages/public/SuggestionsPage'
import { AdminRoute } from './AdminRoute'
import { CaregiverRoute } from './CaregiverRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/suggestions" element={<SuggestionsPage />} />
          <Route element={<CaregiverRoute />}>
            <Route path="/progress" element={<ProgressPage />} />
          </Route>
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/modules" element={<AdminModulesPage />} />
            <Route path="/admin/contents" element={<AdminContentsPage />} />
            <Route path="/admin/suggestions" element={<AdminSuggestionsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
