import { create } from 'zustand'

export type SessionState =
  | { type: 'loading' }
  | { type: 'anon'; userId: string }
  | { type: 'user'; userId: string }
  | { type: 'org'; userId: string; orgId: string; orgName: string }

interface SessionStore {
  session: SessionState
  setSession: (s: SessionState) => void
  reset: () => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: { type: 'loading' },
  setSession: (s) => set({ session: s }),
  reset: () => set({ session: { type: 'loading' } }),
}))
