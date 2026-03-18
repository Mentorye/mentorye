import { useSessionStore } from '@/stores/sessionStore'
import { ChatListPanel } from '@/components/org-dashboard/ChatListPanel'

export function OrgDashboardPage() {
  const { session } = useSessionStore()
  if (session.type !== 'org') return null

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Painel de Conversas</h1>
          <p className="text-sm text-gray-400">{session.orgName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-sm w-full border-r border-gray-100 bg-white overflow-y-auto">
          <ChatListPanel orgId={session.orgId} />
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center flex-1 text-gray-400">
        <div className="text-center">
          <span className="text-5xl">💬</span>
          <p className="mt-3">Selecione uma conversa para começar</p>
        </div>
      </div>
    </div>
  )
}
