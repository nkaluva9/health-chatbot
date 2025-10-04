import { useEffect, useRef, useState } from 'react';
import {
  makeStyles,
  tokens,
  FluentProvider,
  webLightTheme,
} from '@fluentui/react-components';
import { DirectLine } from 'botframework-directlinejs';
import { MessageSquare, Settings } from 'lucide-react';
import { createDirectLineService, MockDirectLineService } from '../services/directLineService';
import { useDirectLineChat } from '../hooks/useDirectLineChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { PrivacyConsentModal } from './PrivacyConsentModal';
import { SessionHistorySidebar } from './SessionHistorySidebar';
import { DataRetentionSettings } from './DataRetentionSettings';
import { ChatHistoryService } from '../services/chatHistoryService';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    fontFamily: tokens.fontFamilyBase,
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    scrollBehavior: 'smooth',
  },
  welcomeMessage: {
    textAlign: 'center',
    padding: `${tokens.spacingVerticalXXXL} ${tokens.spacingHorizontalL}`,
    color: tokens.colorNeutralForeground3,
  },
  welcomeTitle: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
    color: tokens.colorNeutralForeground1,
  },
  welcomeText: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    marginBottom: tokens.spacingVerticalM,
  },
  suggestionChips: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: tokens.spacingVerticalXL,
  },
  chip: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    cursor: 'pointer',
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralForegroundOnBrand,
      borderColor: tokens.colorBrandBackground,
    },
  },
});

export interface ChatContainerProps {
  directLineToken?: string;
  userId?: string;
  useMock?: boolean;
  enablePersistence?: boolean;
}

export const ChatContainer = ({
  directLineToken,
  userId = 'user_001',
  useMock = true,
  enablePersistence = false,
}: ChatContainerProps) => {
  const styles = useStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [directLine, setDirectLine] = useState<DirectLine | MockDirectLineService | null>(null);

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSessionTitle, setCurrentSessionTitle] = useState<string>('New Conversation');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const service = createDirectLineService(
      { token: directLineToken, webSocket: true },
      useMock,
      { userId, userName: 'User' }
    );
    setDirectLine(service);

    return () => {
      if (service && 'end' in service) {
        service.end();
      }
    };
  }, [directLineToken, userId, useMock]);

  useEffect(() => {
    if (enablePersistence) {
      checkPrivacyConsent();
    }
  }, [enablePersistence, userId]);

  const checkPrivacyConsent = async () => {
    try {
      const preferences = await ChatHistoryService.getUserPreferences(userId);
      if (preferences?.dataSharingConsent) {
        setHasConsent(true);
        await loadOrCreateSession();
      } else {
        setShowConsentModal(true);
      }
    } catch (error) {
      console.error('Error checking consent:', error);
      setShowConsentModal(true);
    }
  };

  const loadOrCreateSession = async () => {
    try {
      const sessions = await ChatHistoryService.getSessions(userId, false);
      if (sessions.length > 0) {
        setCurrentSessionId(sessions[0].id);
        await loadSessionMessages(sessions[0].id);
      } else {
        await createNewSession();
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const session = await ChatHistoryService.createSession({
        userId,
        title: 'New Conversation',
      });
      setCurrentSessionId(session.id);
      clearHistory();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const sessionMessages = await ChatHistoryService.getMessages(sessionId);
      console.log('📥 Loading session messages:', sessionId, '|', sessionMessages.length, 'messages');

      const restoredMessages = sessionMessages.map((msg) => {
        const isUserMessage = msg.messageType === 'user';
        const restoredMsg = {
          id: msg.id,
          type: 'message' as const,
          from: {
            id: isUserMessage ? userId : 'bot',
            name: isUserMessage ? 'User' : 'Healthcare Assistant'
          },
          text: msg.content || '',
          timestamp: msg.createdAt,
          channelData: {},
          attachments: msg.attachments && Array.isArray(msg.attachments) ? msg.attachments : undefined,
        };
        console.log('💬 Restored message:', {
          type: msg.messageType,
          fromId: restoredMsg.from.id,
          text: restoredMsg.text.substring(0, 50) + '...'
        });
        return restoredMsg;
      });

      console.log('✅ Loading', restoredMessages.length, 'messages into chat');
      loadMessages(restoredMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleConsentAccept = async () => {
    try {
      await ChatHistoryService.createOrUpdatePreferences(userId, {
        dataSharingConsent: true,
        retentionDays: 90,
        maxSessions: 100,
        autoArchive: true,
      });
      setHasConsent(true);
      setShowConsentModal(false);
      await createNewSession();
    } catch (error) {
      console.error('Error saving consent:', error);
      alert('Failed to save preferences. Please try again.');
    }
  };

  const handleConsentDecline = () => {
    setShowConsentModal(false);
    setHasConsent(false);
  };

  const handleSessionSelect = async (sessionId: string) => {
    console.log('🔄 Switching to session:', sessionId);
    setCurrentSessionId(sessionId);
    await loadSessionMessages(sessionId);

    const session = await ChatHistoryService.getSession(sessionId);
    if (session) {
      console.log('📝 Session title:', session.title);
      setCurrentSessionTitle(session.title);
    }
    setShowSidebar(false);
  };

  const handleNewSession = async () => {
    await createNewSession();
    setCurrentSessionTitle('New Conversation');
  };

  const {
    messages,
    isTyping,
    isOnline,
    isConnecting,
    sendMessage: originalSendMessage,
    clearHistory,
    loadMessages,
  } = useDirectLineChat({
    directLine: directLine!,
    userId,
    onError: (err) => {
      console.error('DirectLine error:', err);
    },
  });

  const sendMessage = async (text: string) => {
    originalSendMessage(text);

    if (enablePersistence && hasConsent && currentSessionId) {
      try {
        await ChatHistoryService.createMessage({
          sessionId: currentSessionId,
          userId,
          messageType: 'user',
          content: text,
        });

        const session = await ChatHistoryService.getSession(currentSessionId);
        if (session && session.messageCount === 1 && session.title === 'New Conversation') {
          const title = text.length > 50 ? text.substring(0, 50) + '...' : text;
          await ChatHistoryService.updateSession(currentSessionId, { title });
        }
      } catch (error) {
        console.error('Error saving user message:', error);
      }
    }
  };

  useEffect(() => {
    if (enablePersistence && hasConsent && currentSessionId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.from?.id !== userId) {
        saveBotMessage(lastMessage);
      }
    }
  }, [messages]);

  const saveBotMessage = async (message: any) => {
    if (!currentSessionId) return;

    try {
      await ChatHistoryService.createMessage({
        sessionId: currentSessionId,
        userId,
        messageType: 'bot',
        content: message.text || '',
        attachments: message.attachments,
      });
    } catch (error) {
      console.error('Error saving bot message:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCardAction = (action: any) => {
    console.log('Card action:', action);

    if (action.type === 'Action.Submit' && action.data) {
      const actionText = `Action: ${action.data.action || 'submit'}`;
      sendMessage(actionText);
    } else if (action.type === 'Action.OpenUrl' && action.url) {
      window.open(action.url, '_blank');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const suggestions = [
    'Show me a card',
    'Show me images',
    'Show me options',
    'Show me a list',
  ];

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        {enablePersistence && (
          <>
            <PrivacyConsentModal
              isOpen={showConsentModal}
              onAccept={handleConsentAccept}
              onDecline={handleConsentDecline}
            />
            <SessionHistorySidebar
              userId={userId}
              currentSessionId={currentSessionId}
              onSessionSelect={handleSessionSelect}
              onNewSession={handleNewSession}
              onSettingsClick={() => setShowSettings(true)}
              isOpen={showSidebar}
              onClose={() => setShowSidebar(false)}
            />
            <DataRetentionSettings
              userId={userId}
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
            />
          </>
        )}

        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b shadow-sm">
          {enablePersistence && hasConsent && (
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
              title="Chat History"
            >
              <MessageSquare className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </button>
          )}
          <div className="flex-1 flex items-center gap-3">
            {enablePersistence && hasConsent && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-900">{currentSessionTitle}</span>
              </div>
            )}
            <ChatHeader
              isOnline={isOnline}
              isConnecting={isConnecting}
              onClearHistory={clearHistory}
            />
          </div>
          {enablePersistence && hasConsent && (
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors group"
              title="Privacy Settings"
            >
              <Settings className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
          )}
        </div>

        <div className={styles.messagesContainer}>
          {messages.length === 0 && (
            <div className={styles.welcomeMessage}>
              <h1 className={styles.welcomeTitle}>Welcome to Chat Assistant</h1>
              <p className={styles.welcomeText}>
                This is a demo chatbot using Direct Line v3 with Adaptive Cards.
              </p>
              <p className={styles.welcomeText}>
                Try one of these suggestions to see different card types:
              </p>
              <div className={styles.suggestionChips}>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className={styles.chip}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => {
            const isUser = message.from?.id === userId;
            return (
              <ChatMessage
                key={message.id || index}
                message={message}
                isUser={isUser}
                onCardAction={handleCardAction}
              />
            );
          })}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSend={sendMessage}
          disabled={!isOnline}
          placeholder={
            isOnline
              ? 'Type your message...'
              : isConnecting
              ? 'Connecting...'
              : 'Not connected'
          }
        />
      </div>
    </FluentProvider>
  );
};
