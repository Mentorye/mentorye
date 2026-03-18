import { useNavigate, useParams } from 'react-router-dom'
import { useOrganization } from '@/hooks/useOrganizations'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { supabase } from '@/lib/supabase'
import { useSessionStore } from '@/stores/sessionStore'
import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'

const typeLabels: Record<string, string> = {
  church: 'Igreja',
  ngo: 'ONG',
  counseling: 'Aconselhamento',
  other: 'Mentor',
}

export function OrgDetailPage() {
  const { orgId } = useParams<{ orgId: string }>()
  const { org, loading } = useOrganization(orgId ?? '')
  const { session } = useSessionStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [starting, setStarting] = useState(false)

  async function handleStartChat() {
    if (!org || session.type === 'loading') return
    setStarting(true)
    try {
      const userId = session.userId
      const { data: chat, error } = await supabase
        .from('chats')
        .insert({
          user_id: userId,
          organization_id: org.id,
          status: 'open',
          is_anonymous: session.type === 'anon',
        })
        .select()
        .single()

      if (error) throw error
      navigate(`/chat/${(chat as { id: string }).id}`)
    } catch {
      toast('Não foi possível iniciar a conversa. Tente novamente.', 'error')
    } finally {
      setStarting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (!org) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-gray-400">
        <span className="text-4xl">😕</span>
        <p className="mt-2">Mentor não encontrado.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-700 mb-6 transition"
      >
        ← Voltar
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-primary-50 px-6 py-8 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow">
            {org.logo_url ? (
              <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">🏢</span>
            )}
          </div>
          <div>
            <Badge color="indigo">{typeLabels[org.type] ?? 'Mentor'}</Badge>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{org.name}</h1>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-5">
          {org.description && (
            <p className="text-gray-600 leading-relaxed">{org.description}</p>
          )}

          {org.contact_email && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>📧</span>
              <a href={`mailto:${org.contact_email}`} className="hover:text-primary-600 transition">
                {org.contact_email}
              </a>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl mt-0.5">🔒</span>
            <div className="text-sm text-green-800">
              <p className="font-semibold">Conversa 100% anônima</p>
              <p className="mt-0.5 text-green-700">Você não precisa informar seu nome ou criar conta. Caso queira salvar o histórico, pode criar uma conta depois.</p>
            </div>
          </div>

          <Button
            size="lg"
            fullWidth
            loading={starting}
            onClick={handleStartChat}
          >
            💬 Iniciar conversa
          </Button>
        </div>
      </div>
    </div>
  )
}
