export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
          last_message_at: string
          is_archived: boolean
          expires_at: string
          message_count: number
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          created_at?: string
          updated_at?: string
          last_message_at?: string
          is_archived?: boolean
          expires_at?: string
          message_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
          last_message_at?: string
          is_archived?: boolean
          expires_at?: string
          message_count?: number
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string
          message_type: 'user' | 'bot'
          content: string | null
          attachments: Json | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          message_type?: 'user' | 'bot'
          content?: string | null
          attachments?: Json | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          message_type?: 'user' | 'bot'
          content?: string | null
          attachments?: Json | null
          metadata?: Json | null
          created_at?: string
        }
      }
      user_chat_preferences: {
        Row: {
          user_id: string
          retention_days: number
          max_sessions: number
          auto_archive: boolean
          data_sharing_consent: boolean
          updated_at: string
        }
        Insert: {
          user_id: string
          retention_days?: number
          max_sessions?: number
          auto_archive?: boolean
          data_sharing_consent?: boolean
          updated_at?: string
        }
        Update: {
          user_id?: string
          retention_days?: number
          max_sessions?: number
          auto_archive?: boolean
          data_sharing_consent?: boolean
          updated_at?: string
        }
      }
    }
  }
}
