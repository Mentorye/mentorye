import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'

interface RegisterModalProps {
  open: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ open, onClose, onSwitchToLogin }: RegisterModalProps) {
  const toast = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return }
    setLoading(true)

    try {
      // Convert anon user to registered (preserves all data)
      const { error: updateError } = await supabase.auth.updateUser({ email, password })
      if (updateError) throw updateError

      // Update public users table with name
      const { data: { user } } = await supabase.auth.getUser()
      if (user && name.trim()) {
        await supabase.from('users').upsert({ id: user.id, name: name.trim(), email })
      }

      toast('Conta criada! Seu histórico foi salvo.', 'success')
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar conta.'
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('Este e-mail já está em uso.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Criar conta gratuita">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="bg-primary-50 text-primary-800 text-sm rounded-xl px-4 py-3">
          💾 Criar conta salva todo o seu histórico de conversas.
        </div>

        <Input
          label="Seu nome (opcional)"
          placeholder="Como quer ser chamado?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Criar conta e salvar histórico
        </Button>

        <p className="text-center text-sm text-gray-500">
          Já tem conta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary-600 font-medium hover:underline"
          >
            Entrar
          </button>
        </p>
      </form>
    </Modal>
  )
}
