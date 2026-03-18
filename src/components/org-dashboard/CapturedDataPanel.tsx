import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import type { CapturedDataEntry } from '@/types'

interface CapturedDataPanelProps {
  chatId: string
  orgId: string
  userId?: string
}

export function CapturedDataPanel({ chatId, orgId, userId }: CapturedDataPanelProps) {
  const [entries, setEntries] = useState<CapturedDataEntry[]>([])
  const [newField, setNewField] = useState('')
  const [newValue, setNewValue] = useState('')
  const [adding, setAdding] = useState(false)
  const toast = useToast()

  useEffect(() => {
    supabase
      .from('captured_data')
      .select('*')
      .eq('chat_id', chatId)
      .eq('organization_id', orgId)
      .order('captured_at', { ascending: true })
      .then(({ data }) => setEntries((data as CapturedDataEntry[]) ?? []))
  }, [chatId, orgId])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newField.trim() || !newValue.trim()) return
    setAdding(true)
    try {
      const { data, error } = await supabase
        .from('captured_data')
        .insert({
          chat_id: chatId,
          organization_id: orgId,
          field_name: newField.trim(),
          field_value: newValue.trim(),
        })
        .select()
        .single()
      if (error) throw error
      setEntries((prev) => [...prev, data as CapturedDataEntry])
      setNewField('')
      setNewValue('')

      // Also update users.captured_data jsonb if userId available
      if (userId) {
        await supabase.rpc('update_user_captured_data' as never, {
          p_user_id: userId,
          p_field: newField.trim(),
          p_value: newValue.trim(),
        } as never).then(() => {}) // best-effort, ignore error
      }
    } catch {
      toast('Não foi possível salvar. Tente novamente.', 'error')
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(id: string) {
    await supabase.from('captured_data').delete().eq('id', id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-gray-900 text-sm">Dados capturados</h3>

      {entries.length > 0 ? (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-start justify-between gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{entry.field_name}</p>
                <p className="text-sm text-gray-900 mt-0.5">{entry.field_value}</p>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-gray-300 hover:text-red-400 transition shrink-0 mt-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-2">Nenhum dado registrado ainda.</p>
      )}

      <form onSubmit={handleAdd} className="flex flex-col gap-2 border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-500 font-medium">Adicionar informação</p>
        <Input
          placeholder="Campo (ex: Telefone, Nome)"
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
        />
        <Input
          placeholder="Valor"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          loading={adding}
          disabled={!newField.trim() || !newValue.trim()}
        >
          Salvar informação
        </Button>
      </form>
    </div>
  )
}
