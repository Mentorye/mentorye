import { useRef, useState } from 'react'
import { AudioRecorder } from './AudioRecorder'
import { AttachmentPicker } from './AttachmentPicker'
import { Spinner } from '@/components/ui/Spinner'

interface MessageInputProps {
  onSendText: (text: string) => void
  onSendAudio: (blob: Blob, duration: number) => void
  onSendFile: (file: File) => void
  disabled?: boolean
  uploading?: boolean
}

export function MessageInput({ onSendText, onSendAudio, onSendFile, disabled, uploading }: MessageInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSendText(trimmed)
    setText('')
    textareaRef.current?.focus()
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value)
    // Auto-resize
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-3">
      <div className="flex items-end gap-2 bg-gray-50 rounded-2xl px-3 py-2 border border-gray-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition">
        <AttachmentPicker onFile={onSendFile} disabled={disabled || uploading} />

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem..."
          rows={1}
          disabled={disabled || uploading}
          className="flex-1 bg-transparent resize-none text-base text-gray-900 placeholder-gray-400 focus:outline-none py-1 leading-relaxed disabled:opacity-50"
          style={{ maxHeight: '120px' }}
        />

        <AudioRecorder onRecorded={onSendAudio} disabled={disabled || uploading} />

        <button
          type="button"
          onClick={submit}
          disabled={!text.trim() || disabled || uploading}
          className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {uploading ? (
            <Spinner size="sm" className="text-white" />
          ) : (
            <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
      {uploading && (
        <p className="text-xs text-gray-400 text-center mt-1">Enviando arquivo...</p>
      )}
    </div>
  )
}
