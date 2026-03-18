import type { Message } from '@/types'
import { AudioPlayer } from './AudioPlayer'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const align = isOwn ? 'items-end' : 'items-start'
  const bubbleColor = isOwn
    ? 'bg-primary-600 text-white'
    : 'bg-white text-gray-900 border border-gray-100'

  return (
    <div className={`flex flex-col ${align} gap-1 max-w-[80%] ${isOwn ? 'self-end' : 'self-start'}`}>
      <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${bubbleColor}`}>
        {message.type === 'text' && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}

        {message.type === 'audio' && message.file_url && (
          <AudioPlayer src={message.file_url} fileName={message.file_name ?? undefined} />
        )}

        {message.type === 'image' && message.file_url && (
          <a href={message.file_url} target="_blank" rel="noopener noreferrer">
            <img
              src={message.file_url}
              alt={message.file_name ?? 'imagem'}
              className="max-w-xs rounded-xl object-cover"
            />
          </a>
        )}

        {message.type === 'document' && (
          <a
            href={message.file_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:underline"
          >
            <span className="text-lg">📄</span>
            <span className="truncate max-w-[200px]">{message.file_name ?? 'Documento'}</span>
          </a>
        )}
      </div>
      <span className="text-xs text-gray-400 px-1">{formatTime(message.created_at)}</span>
    </div>
  )
}
