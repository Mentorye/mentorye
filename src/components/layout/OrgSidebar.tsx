import { NavLink } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useSessionStore } from '@/stores/sessionStore'

export function OrgSidebar() {
  const { session } = useSessionStore()
  const orgName = session.type === 'org' ? session.orgName : ''

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  const navItem = (to: string, icon: string, label: string) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
         ${isActive ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </NavLink>
  )

  return (
    <aside className="w-64 shrink-0 border-r border-gray-100 bg-white flex flex-col min-h-screen">
      <div className="p-5 border-b border-gray-100">
        <span className="text-2xl">🤝</span>
        <p className="text-lg font-bold text-primary-700 mt-1">MentorYe</p>
        {orgName && <p className="text-xs text-gray-500 mt-0.5 truncate">{orgName}</p>}
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItem('/org-portal/dashboard', '💬', 'Conversas')}
        {navItem('/org-portal/users', '👥', 'Pessoas')}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <span className="text-lg">🚪</span>
          Sair
        </button>
      </div>
    </aside>
  )
}
