import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSessionStore } from '@/stores/sessionStore'

export function useSession() {
  const { session, setSession } = useSessionStore()

  useEffect(() => {
    let mounted = true

    async function init() {
      const { data: { session: authSession } } = await supabase.auth.getSession()

      if (!authSession) {
        // Sign in anonymously on first visit
        // The on_auth_user_created trigger creates the public.users row automatically
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error || !data.user) return
        if (mounted) setSession({ type: 'anon', userId: data.user.id })
        return
      }

      const userId = authSession.user.id
      const isAnon = authSession.user.is_anonymous ?? false

      if (isAnon) {
        if (mounted) setSession({ type: 'anon', userId })
        return
      }

      // Check if this user is an org member
      const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id, organizations(name)')
        .eq('user_id', userId)
        .maybeSingle()

      if (member) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orgName = (member as any).organizations?.name ?? ''
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orgId = (member as any).organization_id as string
        if (mounted) setSession({ type: 'org', userId, orgId, orgName })
      } else {
        if (mounted) setSession({ type: 'user', userId })
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, authSession) => {
      if (!mounted) return

      if (!authSession) {
        setSession({ type: 'loading' })
        return
      }

      const userId = authSession.user.id
      const isAnon = authSession.user.is_anonymous ?? false

      if (isAnon) {
        setSession({ type: 'anon', userId })
        return
      }

      if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
        const { data: member } = await supabase
          .from('organization_members')
          .select('organization_id, organizations(name)')
          .eq('user_id', userId)
          .maybeSingle()

        if (member) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const orgName = (member as any).organizations?.name ?? ''
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const orgId = (member as any).organization_id as string
          setSession({ type: 'org', userId, orgId, orgName })
        } else {
          setSession({ type: 'user', userId })
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setSession])

  return session
}
