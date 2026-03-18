import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserRoutes } from './UserRoutes'
import { OrgRoutes } from './OrgRoutes'
import { OrgLoginPage } from '@/pages/org/OrgLoginPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/org-portal/login" element={<OrgLoginPage />} />
        <Route path="/org-portal/*" element={<OrgRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
