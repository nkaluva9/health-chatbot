import { useState, useEffect, useCallback, useRef } from 'react';
import { DirectLine, ConnectionStatus, Activity, Message } from 'botframework-directlinejs';
import { MockDirectLineService } from '../services/directLineService';

export interface UseDirectLineChatOptions {
  directLine: DirectLine | MockDirectLineService;
  userId: string;
  onError?: (error: Error) => void;
}

export interface DirectLineChatState {
  messages: Message[];
  isTyping: boolean;
  isOnline: boolean;
  isConnecting: boolean;
  connectionStatus: ConnectionStatus;
  conversationId: string | null;
}

export const useDirectLineChat = ({
  directLine,
  userId,
  onError,
}: UseDirectLineChatOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.Uninitialized
  );
  const [conversationId, setConversationId] = useState<string | null>(null);

  const activitySubscriptionRef = useRef<any>(null);
  const connectionSubscriptionRef = useRef<any>(null);

  const handleActivity = useCallback(
    (activity: Activity) => {
      if (activity.type === 'message') {
        const messageActivity = activity as Message;

        if (messageActivity.from?.id !== userId) {
          setMessages((prev) => [...prev, messageActivity]);
          setIsTyping(false);
        }
      } else if (activity.type === 'typing') {
        if (activity.from?.id !== userId) {
          setIsTyping(true);
        }
      }

      if (activity.conversation?.id && !conversationId) {
        setConversationId(activity.conversation.id);
      }
    },
    [userId, conversationId]
  );

  const handleConnectionStatusChange = useCallback(
    (status: ConnectionStatus) => {
      setConnectionStatus(status);

      if (status === ConnectionStatus.FailedToConnect || status === ConnectionStatus.Ended) {
        onError?.(new Error('Connection failed or ended'));
      }
    },
    [onError]
  );

  useEffect(() => {
    if (!directLine) return;

    activitySubscriptionRef.current = directLine.activity$.subscribe(
      handleActivity,
      (error) => {
        console.error('Activity subscription error:', error);
        onError?.(error);
      }
    );

    connectionSubscriptionRef.current = directLine.connectionStatus$.subscribe(
      handleConnectionStatusChange,
      (error) => {
        console.error('Connection status subscription error:', error);
        onError?.(error);
      }
    );

    return () => {
      activitySubscriptionRef.current?.unsubscribe();
      connectionSubscriptionRef.current?.unsubscribe();
    };
  }, [directLine, handleActivity, handleConnectionStatusChange, onError]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!directLine || connectionStatus !== ConnectionStatus.Online) {
        onError?.(new Error('Cannot send message: not connected'));
        return;
      }

      if (!text.trim()) return;

      const activity: Activity = {
        type: 'message',
        from: { id: userId },
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [
        ...prev,
        {
          ...activity,
          id: `msg_${Date.now()}`,
          conversation: conversationId ? { id: conversationId } : undefined,
        } as Message,
      ]);

      directLine.postActivity(activity).subscribe({
        error: (error) => {
          console.error('Error sending message:', error);
          onError?.(error);
        },
      });
    },
    [directLine, connectionStatus, userId, conversationId, onError]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  const loadMessages = useCallback((historicalMessages: Message[]) => {
    setMessages(historicalMessages);
  }, []);

  const isOnline = connectionStatus === ConnectionStatus.Online;
  const isConnecting = connectionStatus === ConnectionStatus.Connecting;

  return {
    messages,
    isTyping,
    isOnline,
    isConnecting,
    connectionStatus,
    conversationId,
    sendMessage,
    clearHistory,
    loadMessages,
  };
};
