import { ToastProvider } from '@/components/ui/Toast'
import { AppRouter } from '@/routes'
import { useSession } from '@/hooks/useSession'

function SessionInit() {
  useSession()
  return null
}

export function App() {
  return (
    <ToastProvider>
      <SessionInit />
      <AppRouter />
    </ToastProvider>
  )
}
