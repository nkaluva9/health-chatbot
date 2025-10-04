import { supabase } from '../lib/supabase';
import type {
  ChatSession,
  ChatMessage,
  UserChatPreferences,
  CreateSessionParams,
  CreateMessageParams,
  UpdatePreferencesParams,
} from '../types/chat';

export class ChatHistoryService {
  static async getUserPreferences(userId: string): Promise<UserChatPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_chat_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      return {
        userId: String(data.user_id),
        retentionDays: data.retention_days as 30 | 60 | 90,
        maxSessions: Number(data.max_sessions),
        autoArchive: Boolean(data.auto_archive),
        dataSharingConsent: Boolean(data.data_sharing_consent),
        updatedAt: String(data.updated_at),
      };
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  static async createOrUpdatePreferences(
    userId: string,
    preferences: UpdatePreferencesParams
  ): Promise<UserChatPreferences> {
    try {
      const updateData: Record<string, unknown> = {
        user_id: userId,
      };

      if (preferences.retentionDays !== undefined) updateData.retention_days = preferences.retentionDays;
      if (preferences.maxSessions !== undefined) updateData.max_sessions = preferences.maxSessions;
      if (preferences.autoArchive !== undefined) updateData.auto_archive = preferences.autoArchive;
      if (preferences.dataSharingConsent !== undefined) updateData.data_sharing_consent = preferences.dataSharingConsent;

      const { data, error } = await supabase
        .from('user_chat_preferences')
        .upsert(updateData)
        .select()
        .single();

      if (error) throw error;

      return {
        userId: String(data.user_id),
        retentionDays: data.retention_days as 30 | 60 | 90,
        maxSessions: Number(data.max_sessions),
        autoArchive: Boolean(data.auto_archive),
        dataSharingConsent: Boolean(data.data_sharing_consent),
        updatedAt: String(data.updated_at),
      };
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  static async getSessions(userId: string, includeArchived = false): Promise<ChatSession[]> {
    try {
      let query = supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId);

      if (!includeArchived) {
        query = query.eq('is_archived', false);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((session) => ({
        id: String(session.id),
        userId: String(session.user_id),
        title: String(session.title),
        messageCount: Number(session.message_count),
        isArchived: Boolean(session.is_archived),
        expiresAt: String(session.expires_at),
        createdAt: String(session.created_at),
        updatedAt: String(session.updated_at),
        lastMessageAt: String(session.last_message_at),
      }));
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  static async getSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: String(data.id),
        userId: String(data.user_id),
        title: String(data.title),
        messageCount: Number(data.message_count),
        isArchived: Boolean(data.is_archived),
        expiresAt: String(data.expires_at),
        createdAt: String(data.created_at),
        updatedAt: String(data.updated_at),
        lastMessageAt: String(data.last_message_at),
      };
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  }

  static async createSession(params: CreateSessionParams): Promise<ChatSession> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: params.userId,
          title: params.title || 'New Conversation',
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: String(data.id),
        userId: String(data.user_id),
        title: String(data.title),
        messageCount: Number(data.message_count),
        isArchived: Boolean(data.is_archived),
        expiresAt: String(data.expires_at),
        createdAt: String(data.created_at),
        updatedAt: String(data.updated_at),
        lastMessageAt: String(data.last_message_at),
      };
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  static async updateSession(
    sessionId: string,
    updates: { title?: string; isArchived?: boolean }
  ): Promise<ChatSession> {
    try {
      const updateData: Record<string, unknown> = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;

      const { data, error } = await supabase
        .from('chat_sessions')
        .update(updateData)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: String(data.id),
        userId: String(data.user_id),
        title: String(data.title),
        messageCount: Number(data.message_count),
        isArchived: Boolean(data.is_archived),
        expiresAt: String(data.expires_at),
        createdAt: String(data.created_at),
        updatedAt: String(data.updated_at),
        lastMessageAt: String(data.last_message_at),
      };
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  static async deleteSession(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  static async getMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map((msg) => ({
        id: String(msg.id),
        sessionId: String(msg.session_id),
        userId: String(msg.user_id),
        messageType: msg.message_type as 'user' | 'bot',
        content: msg.content ? String(msg.content) : null,
        attachments: msg.attachments,
        metadata: msg.metadata as Record<string, unknown> | undefined,
        createdAt: String(msg.created_at),
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  static async createMessage(params: CreateMessageParams): Promise<ChatMessage> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: params.sessionId,
          user_id: params.userId,
          message_type: params.messageType,
          content: params.content,
          attachments: params.attachments || null,
          metadata: params.metadata || null,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: String(data.id),
        sessionId: String(data.session_id),
        userId: String(data.user_id),
        messageType: data.message_type as 'user' | 'bot',
        content: data.content ? String(data.content) : null,
        attachments: data.attachments,
        metadata: data.metadata as Record<string, unknown> | undefined,
        createdAt: String(data.created_at),
      };
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  static async archiveSession(sessionId: string): Promise<void> {
    try {
      await this.updateSession(sessionId, { isArchived: true });
    } catch (error) {
      console.error('Error archiving session:', error);
      throw error;
    }
  }

  static async searchSessions(userId: string, searchTerm: string): Promise<ChatSession[]> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .ilike('title', `%${searchTerm}%`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((session) => ({
        id: String(session.id),
        userId: String(session.user_id),
        title: String(session.title),
        messageCount: Number(session.message_count),
        isArchived: Boolean(session.is_archived),
        expiresAt: String(session.expires_at),
        createdAt: String(session.created_at),
        updatedAt: String(session.updated_at),
        lastMessageAt: String(session.last_message_at),
      }));
    } catch (error) {
      console.error('Error searching sessions:', error);
      throw error;
    }
  }
}
