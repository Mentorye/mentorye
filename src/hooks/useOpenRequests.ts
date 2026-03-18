import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { OpenRequest } from '@/types'

export function useOpenRequests() {
  const [requests, setRequests] = useState<OpenRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('open_requests')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRequests((data as OpenRequest[]) ?? [])
        setLoading(false)
      })

    const channel = supabase
      .channel('open_requests_feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'open_requests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const req = payload.new as OpenRequest
            if (req.status === 'open') {
              setRequests((prev) => [req, ...prev])
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as OpenRequest
            setRequests((prev) =>
              updated.status !== 'open'
                ? prev.filter((r) => r.id !== updated.id)
                : prev.map((r) => (r.id === updated.id ? updated : r))
            )
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { requests, loading }
}
