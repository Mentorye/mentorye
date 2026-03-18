import { useState } from 'react'
import { uploadChatFile } from '@/lib/uploadHelpers'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(
    chatId: string,
    messageId: string,
    file: File | Blob,
    type: 'audio' | 'images' | 'docs',
    fileName?: string
  ): Promise<string | null> {
    setUploading(true)
    setError(null)
    try {
      const path = await uploadChatFile(chatId, messageId, file, type, fileName)
      return path
    } catch {
      setError('Não foi possível enviar o arquivo. Tente novamente.')
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, error }
}
