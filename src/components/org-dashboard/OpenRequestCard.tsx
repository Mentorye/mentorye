import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import type { OpenRequest } from '@/types'

interface OpenRequestCardProps {
  request: OpenRequest
  orgId: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora mesmo'
  if (mins < 60) return `há ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `há ${hours}h`
  return `há ${Math.floor(hours / 24)} dias`
}

export function OpenRequestCard({ request, orgId }: OpenRequestCardProps) {
  const [accepting, setAccepting] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  async function handleAccept() {
    setAccepting(true)
    try {
      const { data, error } = await supabase.rpc('claim_open_request' as never, {
        p_request_id: request.id,
        p_org_id: orgId,
      } as never)
      if (error) throw error
      toast('Solicitação aceita! Iniciando conversa...', 'success')
      navigate(`/org-portal/chat/${data as string}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('Solicitação já aceita')) {
        toast('Essa solicitação já foi aceita por outro mentor.', 'info')
      } else {
        toast('Não foi possível aceitar. Tente novamente.', 'error')
      }
    } finally {
      setAccepting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-yellow-100 p-4 flex flex-col gap-3 hover:border-yellow-200 transition">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full shrink-0" />
            <span className="text-xs text-gray-400">{timeAgo(request.created_at)}</span>
          </div>
          <p className="font-medium text-gray-900 text-sm truncate">{request.title}</p>
          {request.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{request.description}</p>
          )}
        </div>
      </div>

      <Button
        size="sm"
        fullWidth
        loading={accepting}
        onClick={handleAccept}
        className="mt-1"
      >
        Aceitar e conversar
      </Button>
    </div>
  )
}
