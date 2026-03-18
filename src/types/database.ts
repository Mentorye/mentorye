// Minimal Database type for Supabase client generic
export type Database = {
  public: {
    Tables: {
      organizations: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      organization_members: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      users: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      chats: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      messages: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      open_requests: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      captured_data: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
    }
    Functions: {
      claim_open_request: { Args: { p_request_id: string; p_org_id: string }; Returns: string }
    }
  }
}
