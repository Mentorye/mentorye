import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ open, onClose, onSwitchToRegister }: LoginModalProps) {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError
      toast('Bem-vindo de volta!', 'success')
      onClose()
    } catch {
      setError('E-mail ou senha incorretos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Entrar na sua conta">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Entrar
        </Button>

        <p className="text-center text-sm text-gray-500">
          Não tem conta?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary-600 font-medium hover:underline"
          >
            Criar conta
          </button>
        </p>
      </form>
    </Modal>
  )
}
