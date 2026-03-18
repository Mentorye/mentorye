import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useSessionStore } from '@/stores/sessionStore'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { ChatListPanel } from '@/components/org-dashboard/ChatListPanel'
import { CapturedDataPanel } from '@/components/org-dashboard/CapturedDataPanel'
import { Spinner } from '@/components/ui/Spinner'
import type { Chat } from '@/types'

interface ChatWithUser extends Chat {
  users?: { id: string; name: string | null; is_anonymous: boolean } | null
}

export function OrgChatPage() {
  const { chatId } = useParams<{ chatId: string }>()
  const { session } = useSessionStore()
  const navigate = useNavigate()
  const [chat, setChat] = useState<ChatWithUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    if (!chatId || session.type !== 'org') return
    supabase
      .from('chats')
      .select('*, users(id, name, is_anonymous)')
      .eq('id', chatId)
      .eq('organization_id', session.orgId)
      .single()
      .then(({ data }) => {
        if (!data) { navigate('/org-portal/dashboard'); return }
        setChat(data as unknown as ChatWithUser)
        setLoading(false)
      })
  }, [chatId, session, navigate])

  if (session.type !== 'org') return null

  const user = chat?.users
  const userName = user?.name ?? (user?.is_anonymous ? 'Anônimo' : 'Usuário')

  return (
    <div className="flex h-screen">
      {/* Left sidebar: chat list */}
      <div className="w-72 shrink-0 border-r border-gray-100 bg-white overflow-y-auto hidden lg:block">
        <ChatListPanel orgId={session.orgId} />
      </div>

      {/* Center: chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <Link
              to="/org-portal/dashboard"
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 lg:hidden"
            >
              ←
            </Link>
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{userName}</p>
              {user && !user.is_anonymous && (
                <Link
                  to={`/org-portal/user/${user.id}`}
                  className="text-xs text-primary-600 hover:underline"
                >
                  Ver perfil completo
                </Link>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowProfile((v) => !v)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition ${showProfile ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            📋 Dados
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : chatId ? (
          <ChatWindow
            chatId={chatId}
            currentUserId={session.userId}
            senderType="org"
          />
        ) : null}
      </div>

      {/* Right panel: captured data */}
      {showProfile && chat && (
        <div className="w-72 shrink-0 border-l border-gray-100 bg-white p-4 overflow-y-auto">
          <CapturedDataPanel
            chatId={chat.id}
            orgId={session.orgId}
            userId={user?.id}
          />
        </div>
      )}
    </div>
  )
}
