import { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import { useFileUpload } from '@/hooks/useFileUpload'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import type { SenderType } from '@/types'

interface ChatWindowProps {
  chatId: string
  currentUserId: string
  senderType: SenderType
}

export function ChatWindow({ chatId, currentUserId, senderType }: ChatWindowProps) {
  const { messages, loading, sendTextMessage, sendFileMessage } = useChat(chatId)
  const { upload, uploading } = useFileUpload()
  const toast = useToast()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSendText(text: string) {
    await sendTextMessage(currentUserId, senderType, text)
  }

  async function handleSendAudio(blob: Blob, duration: number) {
    const messageId = crypto.randomUUID()
    const path = await upload(chatId, messageId, blob, 'audio', `${messageId}.webm`)
    if (!path) { toast('Não foi possível enviar o áudio.', 'error'); return }
    await sendFileMessage(currentUserId, senderType, 'audio', path, 'Áudio', { duration })
  }

  async function handleSendFile(file: File) {
    const isImage = file.type.startsWith('image/')
    const type = isImage ? 'images' : 'docs'
    const msgType = isImage ? 'image' : 'document'
    const messageId = crypto.randomUUID()
    const path = await upload(chatId, messageId, file, type, `${messageId}_${file.name}`)
    if (!path) { toast('Não foi possível enviar o arquivo.', 'error'); return }
    await sendFileMessage(currentUserId, senderType, msgType, path, file.name, { size: file.size, mimeType: file.type })
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <span className="text-3xl">👋</span>
            <p className="mt-2 text-sm">Nenhuma mensagem ainda. Diga olá!</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender_id === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSendText={handleSendText}
        onSendAudio={handleSendAudio}
        onSendFile={handleSendFile}
        uploading={uploading}
      />
    </div>
  )
}
