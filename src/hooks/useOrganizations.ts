import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Organization } from '@/types'

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('organizations')
      .select('*')
      .order('name')
      .then(({ data, error }) => {
        if (error) setError('Não foi possível carregar as organizações.')
        else setOrganizations((data as Organization[]) ?? [])
        setLoading(false)
      })
  }, [])

  return { organizations, loading, error }
}

export function useOrganization(id: string) {
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setOrg(data as Organization | null)
        setLoading(false)
      })
  }, [id])

  return { org, loading }
}
