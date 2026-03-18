import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useSessionStore } from '@/stores/sessionStore'
import { Spinner } from '@/components/ui/Spinner'
import type { Chat, CapturedDataEntry, UserProfile } from '@/types'

interface ChatWithLastMsg extends Chat {
  messages?: { content: string | null; created_at: string }[] | null
}

export function OrgUserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const { session } = useSessionStore()
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [chats, setChats] = useState<ChatWithLastMsg[]>([])
  const [capturedData, setCapturedData] = useState<CapturedDataEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || session.type !== 'org') return
    const orgId = session.orgId

    async function load() {
      const [userRes, chatsRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).single(),
        supabase
          .from('chats')
          .select('*, messages(content, created_at)')
          .eq('user_id', userId)
          .eq('organization_id', orgId)
          .order('updated_at', { ascending: false }),
      ])

      const chatIds = (chatsRes.data ?? []).map((c: { id: string }) => c.id)
      const dataRes = chatIds.length > 0
        ? await supabase
            .from('captured_data')
            .select('*')
            .eq('organization_id', orgId)
            .in('chat_id', chatIds)
            .order('captured_at', { ascending: true })
        : { data: [] }

      setUser(userRes.data as UserProfile | null)
      setChats((chatsRes.data as ChatWithLastMsg[]) ?? [])
      setCapturedData((dataRes.data as CapturedDataEntry[]) ?? [])
      setLoading(false)
    }

    load()
  }, [userId, session, navigate])

  if (session.type !== 'org') return null

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-700 mb-6 transition"
      >
        ← Voltar
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User info */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-3">
              <span className="text-3xl">👤</span>
            </div>
            <p className="font-bold text-gray-900 text-lg">{user?.name ?? 'Sem nome'}</p>
            {user?.is_anonymous && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Anônimo</span>
            )}
            {user?.email && <p className="text-sm text-gray-500 mt-1">📧 {user.email}</p>}
            {user?.phone && <p className="text-sm text-gray-500">📞 {user.phone}</p>}
          </div>

          {capturedData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Dados coletados</h3>
              <div className="flex flex-col gap-2">
                {capturedData.map((entry) => (
                  <div key={entry.id}>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{entry.field_name}</p>
                    <p className="text-sm text-gray-900">{entry.field_value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat history */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Histórico de conversas</h2>
          {chats.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-gray-100">
              Nenhuma conversa encontrada.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {chats.map((chat) => {
                const msgs = [...(chat.messages ?? [])].sort(
                  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
                const last = msgs[0]
                return (
                  <Link
                    key={chat.id}
                    to={`/org-portal/chat/${chat.id}`}
                    className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-primary-200 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${chat.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {chat.status === 'open' ? 'Ativa' : 'Encerrada'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(chat.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {last?.content && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{last.content}</p>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
