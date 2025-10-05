/*
  # Create Healthcare Chatbot Schema

  ## Overview
  This migration creates the initial database schema for the healthcare chatbot application.
  It includes tables for chat sessions, messages, and user preferences with proper security policies.

  ## Tables Created

  ### 1. chat_sessions
  Stores individual chat sessions for users
  - `id` (uuid, primary key): Unique session identifier
  - `user_id` (text): User identifier (demo mode uses text instead of auth.uid())
  - `title` (text): Session title/name
  - `created_at` (timestamptz): When the session was created
  - `updated_at` (timestamptz): Last update timestamp
  - `last_message_at` (timestamptz): Timestamp of last message
  - `is_archived` (boolean): Whether the session is archived
  - `expires_at` (timestamptz): When the session data expires
  - `message_count` (integer): Count of messages in the session

  ### 2. chat_messages
  Stores individual messages within chat sessions
  - `id` (uuid, primary key): Unique message identifier
  - `session_id` (uuid, foreign key): Reference to chat_sessions
  - `user_id` (text): User identifier
  - `message_type` (text): Either 'user' or 'bot'
  - `content` (text): Message text content
  - `attachments` (jsonb): Any attachments or rich content
  - `metadata` (jsonb): Additional message metadata
  - `created_at` (timestamptz): When the message was created

  ### 3. user_chat_preferences
  Stores user preferences for chat behavior and data retention
  - `user_id` (text, primary key): User identifier
  - `retention_days` (integer): How long to keep chat data
  - `max_sessions` (integer): Maximum number of active sessions
  - `auto_archive` (boolean): Auto-archive old sessions
  - `data_sharing_consent` (boolean): Whether user consents to data sharing
  - `updated_at` (timestamptz): Last update timestamp

  ## Security
  - RLS (Row Level Security) is enabled on all tables
  - Demo mode policies allow all operations (using true)
  - In production, these should be replaced with proper auth.uid() checks

  ## Notes
  - This schema is designed for demo/development use
  - For production, implement proper authentication and stricter RLS policies
  - All timestamps use timestamptz for proper timezone handling
  - JSONB is used for flexible metadata storage
*/

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text DEFAULT 'New Chat',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),
  is_archived boolean DEFAULT false,
  expires_at timestamptz DEFAULT (now() + interval '30 days'),
  message_count integer DEFAULT 0
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  message_type text DEFAULT 'user' CHECK (message_type IN ('user', 'bot')),
  content text,
  attachments jsonb,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_chat_preferences table
CREATE TABLE IF NOT EXISTS user_chat_preferences (
  user_id text PRIMARY KEY,
  retention_days integer DEFAULT 30,
  max_sessions integer DEFAULT 50,
  auto_archive boolean DEFAULT true,
  data_sharing_consent boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message_at ON chat_sessions(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chat_preferences ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for demo mode
-- IMPORTANT: In production, replace these with proper auth.uid() based policies
CREATE POLICY "Demo: Allow all session operations"
  ON chat_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Demo: Allow all message operations"
  ON chat_messages
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Demo: Allow all preference operations"
  ON user_chat_preferences
  FOR ALL
  USING (true)
  WITH CHECK (true);
