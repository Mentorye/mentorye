import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useSessionStore } from '@/stores/sessionStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'

export function OpenRequestPage() {
  const { session } = useSessionStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !message.trim() || session.type === 'loading') return

    setSubmitting(true)
    try {
      const { error } = await supabase.from('open_requests').insert({
        user_id: session.userId,
        title: title.trim(),
        description: message.trim(),
        initial_message: message.trim(),
        status: 'open',
      })
      if (error) throw error
      setSent(true)
    } catch {
      toast('Não foi possível enviar. Tente novamente.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <span className="text-6xl">🙏</span>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Mensagem enviada!</h2>
        <p className="text-gray-500 mt-2">
          Sua solicitação foi enviada para todos os mentores. Assim que alguém aceitar,
          você receberá um aviso e poderá continuar a conversa.
        </p>
        <Button
          size="lg"
          className="mt-8"
          onClick={() => navigate('/')}
        >
          Voltar ao início
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-700 mb-6 transition"
      >
        ← Voltar
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Pedir ajuda a todos os mentores</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Sua mensagem será enviada para todos os mentores disponíveis. O primeiro a responder
          iniciará uma conversa com você.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Como podemos te ajudar? (resumo)"
            placeholder="Ex: Preciso de apoio emocional, orientação financeira..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            label="Conte um pouco mais (opcional, mas ajuda)"
            placeholder="Compartilhe o que você está passando. Pode ser breve."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
            🔒 Você pode responder de forma anônima. Nenhum dado pessoal é exigido.
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={submitting}
            disabled={!title.trim() || !message.trim()}
          >
            Enviar para os mentores
          </Button>
        </form>
      </div>
    </div>
  )
}
