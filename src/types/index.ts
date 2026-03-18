export interface Organization {
  id: string
  name: string
  type: string
  description: string | null
  contact_email: string | null
  logo_url: string | null
  settings: Record<string, unknown> | null
  created_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: string
  created_at: string
}

export interface UserProfile {
  id: string
  email: string | null
  phone: string | null
  name: string | null
  is_anonymous: boolean
  session_id: string | null
  captured_data: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Chat {
  id: string
  user_id: string
  organization_id: string | null
  status: 'open' | 'closed' | 'pending'
  is_anonymous: boolean
  assigned_to_user_id: string | null
  created_at: string
  updated_at: string
}

export type MessageType = 'text' | 'audio' | 'image' | 'document'
export type SenderType = 'user' | 'org'

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  sender_type: SenderType
  type: MessageType
  content: string | null
  file_url: string | null
  file_name: string | null
  metadata: { duration?: number; size?: number; mimeType?: string } | null
  created_at: string
}

export interface OpenRequest {
  id: string
  user_id: string
  title: string
  description: string
  initial_message: string | null
  status: 'open' | 'claimed' | 'cancelled'
  claimed_by_org: string | null
  chat_id: string | null
  created_at: string
  expires_at: string
}

export interface CapturedDataEntry {
  id: string
  chat_id: string
  organization_id: string
  field_name: string
  field_value: string
  captured_at: string
}
