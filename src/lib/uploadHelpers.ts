import { supabase } from './supabase'

const BUCKET = 'chat-files'

export async function uploadChatFile(
  chatId: string,
  messageId: string,
  file: File | Blob,
  type: 'audio' | 'images' | 'docs',
  fileName?: string
): Promise<string> {
  const ext = file instanceof File ? file.name.split('.').pop() : 'webm'
  const name = fileName ?? `${messageId}.${ext}`
  const path = `${chatId}/${type}/${name}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  })

  if (error) throw error
  return path
}

export async function getFileUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24) // 24h

  if (error) throw error
  return data.signedUrl
}
