import { Link } from 'react-router-dom'
import { useSessionStore } from '@/stores/sessionStore'

interface UserNavProps {
  onRegister: () => void
  onLogin: () => void
}

export function UserNav({ onRegister, onLogin }: UserNavProps) {
  const { session } = useSessionStore()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🤝</span>
          <span className="text-xl font-bold text-primary-700">MentorYe</span>
        </Link>

        <div className="flex items-center gap-2">
          {session.type === 'anon' && (
            <>
              <button
                onClick={onLogin}
                className="text-sm font-medium text-gray-600 hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-50 transition"
              >
                Entrar
              </button>
              <button
                onClick={onRegister}
                className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition"
              >
                Criar conta
              </button>
            </>
          )}
          {(session.type === 'user') && (
            <span className="text-sm text-gray-500 bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium">
              Conta ativa
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
