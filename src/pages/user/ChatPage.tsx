import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useSessionStore } from '@/stores/sessionStore'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { Spinner } from '@/components/ui/Spinner'
import type { Chat, Organization } from '@/types'

export function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>()
  const { session } = useSessionStore()
  const navigate = useNavigate()
  const [chat, setChat] = useState<Chat | null>(null)
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!chatId || session.type === 'loading') return

    const userId = 'userId' in session ? session.userId : ''
    supabase
      .from('chats')
      .select('*, organizations(*)')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single()
      .then(({ data }) => {
        if (!data) { navigate('/'); return }
        setChat(data as unknown as Chat)
        setOrg((data as unknown as { organizations: Organization }).organizations)
        setLoading(false)
      })
  }, [chatId, session, navigate])

  if (loading || session.type === 'loading') {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (!chat || !chatId) return null

  const userId = 'userId' in session ? session.userId : ''

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <button
          onClick={() => navigate('/')}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 transition"
        >
          ←
        </button>
        <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center overflow-hidden">
          {org?.logo_url ? (
            <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg">🏢</span>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{org?.name ?? 'Mentor'}</p>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      <ChatWindow
        chatId={chatId}
        currentUserId={userId}
        senderType="user"
      />
    </div>
  )
}
