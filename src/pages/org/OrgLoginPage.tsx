import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

export function OrgLoginPage() {
  const navigate = useNavigate()
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
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError

      const userId = data.user?.id
      const { data: member, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', userId)
        .maybeSingle()

      if (memberError || !member) {
        await supabase.auth.signOut()
        throw new Error('Conta não vinculada a nenhum mentor ou organização.')
      }

      toast('Bem-vindo!', 'success')
      navigate('/org-portal/dashboard')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao entrar.'
      if (msg.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🤝</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Acesso para Mentores</h1>
          <p className="text-gray-500 mt-1 text-sm">Entre com sua conta para acessar o painel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col gap-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="sua@organizacao.com"
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
            <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" fullWidth loading={loading}>
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Acesso exclusivo para mentores e colaboradores cadastrados.
        </p>
      </div>
    </div>
  )
}
