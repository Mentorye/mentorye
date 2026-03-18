import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserNav } from '@/components/layout/UserNav'
import { RegisterModal } from '@/components/auth/RegisterModal'
import { LoginModal } from '@/components/auth/LoginModal'
import { HomePage } from '@/pages/user/HomePage'
import { OrgDetailPage } from '@/pages/user/OrgDetailPage'
import { ChatPage } from '@/pages/user/ChatPage'
import { OpenRequestPage } from '@/pages/user/OpenRequestPage'

export function UserRoutes() {
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <UserNav
        onRegister={() => setShowRegister(true)}
        onLogin={() => setShowLogin(true)}
      />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onRegister={() => setShowRegister(true)} />} />
          <Route path="/org/:orgId" element={<OrgDetailPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="/solicitar" element={<OpenRequestPage />} />
        </Routes>
      </main>

      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true) }}
      />
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true) }}
      />
    </div>
  )
}
