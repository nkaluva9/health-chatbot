import { Message } from 'botframework-directlinejs';
import { makeStyles, tokens, Avatar } from '@fluentui/react-components';
import { Bot24Regular, Person24Regular } from '@fluentui/react-icons';
import { AdaptiveCardRenderer } from './AdaptiveCardRenderer';

const useStyles = makeStyles({
  messageWrapper: {
    display: 'flex',
    marginBottom: tokens.spacingVerticalL,
    gap: tokens.spacingHorizontalM,
  },
  userMessageWrapper: {
    flexDirection: 'row-reverse',
  },
  botMessageWrapper: {
    flexDirection: 'row',
  },
  avatar: {
    flexShrink: 0,
  },
  messageContent: {
    maxWidth: '70%',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  messageText: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusLarge,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1,
    wordWrap: 'break-word',
  },
  userMessageText: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  messageTime: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
  },
  cardContainer: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: tokens.spacingVerticalM,
    boxShadow: tokens.shadow4,
  },
});

export interface ChatMessageProps {
  message: Message;
  isUser: boolean;
  onCardAction?: (action: any) => void;
}

export const ChatMessage = ({ message, isUser, onCardAction }: ChatMessageProps) => {
  const styles = useStyles();

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const hasAdaptiveCard = message.attachments?.some(
    (att) => att.contentType === 'application/vnd.microsoft.card.adaptive'
  );

  const adaptiveCardAttachment = message.attachments?.find(
    (att) => att.contentType === 'application/vnd.microsoft.card.adaptive'
  );

  return (
    <div
      className={`${styles.messageWrapper} ${
        isUser ? styles.userMessageWrapper : styles.botMessageWrapper
      }`}
    >
      <Avatar
        className={styles.avatar}
        icon={isUser ? <Person24Regular /> : <Bot24Regular />}
        color={isUser ? 'brand' : 'colorful'}
        size={36}
      />
      <div className={styles.messageContent}>
        {message.text && (
          <div
            className={`${styles.messageText} ${
              isUser ? styles.userMessageText : ''
            }`}
          >
            {message.text}
          </div>
        )}
        {hasAdaptiveCard && adaptiveCardAttachment && (
          <div className={styles.cardContainer}>
            <AdaptiveCardRenderer
              card={adaptiveCardAttachment.content}
              onAction={onCardAction}
            />
          </div>
        )}
        <div className={styles.messageTime}>{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
};
