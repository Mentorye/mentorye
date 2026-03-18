import { useNavigate } from 'react-router-dom'
import { useOrganizations } from '@/hooks/useOrganizations'
import { OrgCard } from '@/components/organizations/OrgCard'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useSessionStore } from '@/stores/sessionStore'

interface HomePageProps {
  onRegister: () => void
}

export function HomePage({ onRegister }: HomePageProps) {
  const { organizations, loading, error } = useOrganizations()
  const { session } = useSessionStore()
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm font-semibold px-4 py-2 rounded-full mb-5">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          100% anônimo — sem cadastro, sem julgamento
        </div>

        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          Você não precisa<br />passar por isso sozinho
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
          Converse com mentores e igrejas que estão prontos para te ouvir e ajudar.
          Sem burocracia, sem julgamento.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-start justify-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <Button
              size="lg"
              onClick={() => navigate('/solicitar')}
              className="shadow-md"
            >
              💬 Pedir ajuda agora
            </Button>
            <span className="text-xs text-green-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Sem cadastro — totalmente anônimo
            </span>
          </div>
          {session.type === 'anon' && (
            <Button
              size="lg"
              variant="secondary"
              onClick={onRegister}
            >
              Criar conta gratuita
            </Button>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 text-center">
          <span className="text-3xl">🔒</span>
          <p className="font-semibold text-green-800 mt-2">Anônimo se quiser</p>
          <p className="text-sm text-green-700 mt-1">Nenhum dado pessoal é exigido para começar.</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
          <span className="text-3xl">💬</span>
          <p className="font-semibold text-gray-800 mt-2">Conversa direta</p>
          <p className="text-sm text-gray-500 mt-1">Fale por texto, áudio ou envie documentos.</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
          <span className="text-3xl">🤝</span>
          <p className="font-semibold text-gray-800 mt-2">Mentores reais</p>
          <p className="text-sm text-gray-500 mt-1">Igrejas, ONGs e conselheiros voluntários.</p>
        </div>
      </div>

      {/* Org list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Mentores disponíveis</h2>
          <span className="text-sm text-gray-400">{organizations.length} encontrados</span>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl p-4 text-center">
            {error}
          </div>
        )}

        {!loading && organizations.length === 0 && !error && (
          <div className="text-center py-12 text-gray-400">
            <span className="text-4xl">🔍</span>
            <p className="mt-2">Nenhum mentor cadastrado ainda.</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {organizations.map((org) => (
            <OrgCard key={org.id} org={org} />
          ))}
        </div>
      </div>
    </div>
  )
}
