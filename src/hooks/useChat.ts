import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getFileUrl } from '@/lib/uploadHelpers'
import type { Message, MessageType } from '@/types'

export function useChat(chatId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  // Resolve file URLs for media messages
  async function resolveUrls(msgs: Message[]): Promise<Message[]> {
    return Promise.all(
      msgs.map(async (m) => {
        if (m.file_url && m.file_url.startsWith('chat-files/')) {
          try {
            const url = await getFileUrl(m.file_url)
            return { ...m, file_url: url }
          } catch {
            return m
          }
        }
        return m
      })
    )
  }

  useEffect(() => {
    if (!chatId) return

    setLoading(true)
    supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .then(async ({ data }) => {
        const resolved = await resolveUrls((data as Message[]) ?? [])
        setMessages(resolved)
        setLoading(false)
      })

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        async (payload) => {
          const msg = payload.new as Message
          const resolved = await resolveUrls([msg])
          setMessages((prev) => [...prev, resolved[0]])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [chatId])

  const sendTextMessage = useCallback(
    async (senderId: string, senderType: 'user' | 'org', content: string) => {
      if (!chatId) return
      await supabase.from('messages').insert({
        chat_id: chatId,
        sender_id: senderId,
        sender_type: senderType,
        type: 'text',
        content,
      })
    },
    [chatId]
  )

  const sendFileMessage = useCallback(
    async (
      senderId: string,
      senderType: 'user' | 'org',
      type: MessageType,
      storagePath: string,
      fileName: string,
      metadata?: Message['metadata']
    ) => {
      if (!chatId) return
      await supabase.from('messages').insert({
        chat_id: chatId,
        sender_id: senderId,
        sender_type: senderType,
        type,
        file_url: storagePath,
        file_name: fileName,
        metadata: metadata ?? null,
      })
    },
    [chatId]
  )

  return { messages, loading, sendTextMessage, sendFileMessage }
}
