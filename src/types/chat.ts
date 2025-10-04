export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messageCount: number;
  isArchived: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  messageType: 'user' | 'bot';
  content: string | null;
  attachments?: unknown;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface UserChatPreferences {
  userId: string;
  retentionDays: 30 | 60 | 90;
  maxSessions: number;
  autoArchive: boolean;
  dataSharingConsent: boolean;
  updatedAt: string;
}

export interface CreateSessionParams {
  userId: string;
  title?: string;
}

export interface CreateMessageParams {
  sessionId: string;
  userId: string;
  messageType: 'user' | 'bot';
  content: string;
  attachments?: unknown;
  metadata?: Record<string, unknown>;
}

export interface UpdatePreferencesParams {
  retentionDays?: 30 | 60 | 90;
  maxSessions?: number;
  autoArchive?: boolean;
  dataSharingConsent?: boolean;
}
