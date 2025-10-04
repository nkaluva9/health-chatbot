/*
  # Simplify Schema for Demo Mode
  
  ## Changes
  Removes all constraints and recreates tables to work without authentication.
  This is for demo purposes only.
*/

-- Drop all policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public' 
              AND tablename IN ('chat_sessions', 'chat_messages', 'user_chat_preferences'))
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Disable RLS temporarily to modify tables
ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_chat_preferences DISABLE ROW LEVEL SECURITY;

-- Drop foreign key constraints
ALTER TABLE chat_sessions DROP CONSTRAINT IF EXISTS chat_sessions_user_id_fkey;
ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS chat_messages_user_id_fkey;
ALTER TABLE user_chat_preferences DROP CONSTRAINT IF EXISTS user_chat_preferences_user_id_fkey;

-- Change user_id to text
ALTER TABLE chat_sessions ALTER COLUMN user_id TYPE text;
ALTER TABLE chat_messages ALTER COLUMN user_id TYPE text;
ALTER TABLE user_chat_preferences ALTER COLUMN user_id TYPE text;

-- Re-enable RLS with open policies for demo
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chat_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Demo: Allow all operations" ON chat_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo: Allow all operations" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo: Allow all operations" ON user_chat_preferences FOR ALL USING (true) WITH CHECK (true);
