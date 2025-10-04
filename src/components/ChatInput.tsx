import { useState, KeyboardEvent } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Textarea,
} from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    alignItems: 'flex-end',
  },
  textarea: {
    flexGrow: 1,
  },
  sendButton: {
    minWidth: '44px',
    height: '44px',
  },
});

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}: ChatInputProps) => {
  const styles = useStyles();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      <Textarea
        className={styles.textarea}
        value={message}
        onChange={(_, data) => setMessage(data.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        resize="vertical"
        rows={1}
      />
      <Button
        className={styles.sendButton}
        appearance="primary"
        icon={<Send24Regular />}
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        aria-label="Send message"
      />
    </div>
  );
};
