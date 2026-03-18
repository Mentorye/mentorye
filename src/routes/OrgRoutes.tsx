import { Routes, Route, Navigate } from 'react-router-dom'
import { useSessionStore } from '@/stores/sessionStore'
import { OrgSidebar } from '@/components/layout/OrgSidebar'
import { OrgDashboardPage } from '@/pages/org/OrgDashboardPage'
import { OrgChatPage } from '@/pages/org/OrgChatPage'
import { OrgUserDetailPage } from '@/pages/org/OrgUserDetailPage'
import { FullPageSpinner } from '@/components/ui/Spinner'

export function OrgRoutes() {
  const { session } = useSessionStore()

  if (session.type === 'loading') return <FullPageSpinner />
  if (session.type !== 'org') return <Navigate to="/org-portal/login" replace />

  return (
    <div className="flex min-h-screen">
      <OrgSidebar />
      <main className="flex-1 bg-gray-50">
        <Routes>
          <Route path="dashboard" element={<OrgDashboardPage />} />
          <Route path="chat/:chatId" element={<OrgChatPage />} />
          <Route path="user/:userId" element={<OrgUserDetailPage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}
