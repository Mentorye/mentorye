import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useOpenRequests } from '@/hooks/useOpenRequests'
import { OpenRequestCard } from './OpenRequestCard'
import { Spinner } from '@/components/ui/Spinner'
import type { Chat } from '@/types'

interface ChatWithOrg extends Chat {
  users?: { name: string | null } | null
}

interface ChatListPanelProps {
  orgId: string
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export function ChatListPanel({ orgId }: ChatListPanelProps) {
  const [tab, setTab] = useState<'chats' | 'requests'>('chats')
  const [chats, setChats] = useState<ChatWithOrg[]>([])
  const [loadingChats, setLoadingChats] = useState(true)
  const { requests, loading: loadingRequests } = useOpenRequests()
  const { chatId: activeChatId } = useParams<{ chatId: string }>()

  useEffect(() => {
    supabase
      .from('chats')
      .select('*, users(name)')
      .eq('organization_id', orgId)
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setChats((data as ChatWithOrg[]) ?? [])
        setLoadingChats(false)
      })

    const channel = supabase
      .channel(`org_chats:${orgId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats', filter: `organization_id=eq.${orgId}` }, () => {
        supabase
          .from('chats')
          .select('*, users(name)')
          .eq('organization_id', orgId)
          .order('updated_at', { ascending: false })
          .then(({ data }) => setChats((data as ChatWithOrg[]) ?? []))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [orgId])

  const tabBtn = (id: 'chats' | 'requests', label: string, count?: number) => (
    <button
      onClick={() => setTab(id)}
      className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${tab === id ? 'bg-white shadow text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Tab switcher */}
      <div className="p-3 bg-gray-100 m-3 rounded-xl flex gap-1">
        {tabBtn('chats', 'Conversas')}
        {tabBtn('requests', 'Solicitações', requests.length)}
      </div>

      <div className="flex-1 overflow-y-auto px-3 scrollbar-hide">
        {tab === 'chats' && (
          <>
            {loadingChats && <div className="flex justify-center py-8"><Spinner /></div>}
            {!loadingChats && chats.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                <span className="text-2xl">💬</span>
                <p className="mt-2">Nenhuma conversa ainda.</p>
              </div>
            )}
            <div className="flex flex-col gap-1">
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  to={`/org-portal/chat/${chat.id}`}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition ${activeChatId === chat.id ? 'bg-primary-50 border border-primary-100' : 'hover:bg-gray-50'}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <span className="text-lg">👤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {chat.users?.name ?? (chat.is_anonymous ? 'Anônimo' : 'Usuário')}
                      </p>
                      <span className="text-xs text-gray-400 shrink-0">{timeAgo(chat.updated_at)}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {chat.status === 'open' ? 'Conversa ativa' : 'Encerrada'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {tab === 'requests' && (
          <>
            {loadingRequests && <div className="flex justify-center py-8"><Spinner /></div>}
            {!loadingRequests && requests.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                <span className="text-2xl">📭</span>
                <p className="mt-2">Nenhuma solicitação aberta.</p>
              </div>
            )}
            <div className="flex flex-col gap-2 pb-4">
              {requests.map((req) => (
                <OpenRequestCard key={req.id} request={req} orgId={orgId} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
