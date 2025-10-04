import {
  makeStyles,
  tokens,
  Button,
  Spinner,
  Badge,
} from '@fluentui/react-components';
import {
  Delete24Regular,
  CheckmarkCircle24Filled,
  DismissCircle24Filled,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
});

export interface ChatHeaderProps {
  isOnline: boolean;
  isConnecting?: boolean;
  onClearHistory?: () => void;
}

export const ChatHeader = ({
  isOnline,
  isConnecting = false,
  onClearHistory,
}: ChatHeaderProps) => {
  const styles = useStyles();

  const getStatusContent = () => {
    if (isConnecting) {
      return (
        <div className={styles.statusBadge}>
          <Spinner size="extra-tiny" />
          <Badge appearance="outline">Connecting</Badge>
        </div>
      );
    }

    if (isOnline) {
      return (
        <div className={styles.statusBadge}>
          <CheckmarkCircle24Filled style={{ color: tokens.colorPaletteGreenForeground1 }} />
          <Badge appearance="tint" color="success">
            Online
          </Badge>
        </div>
      );
    }

    return (
      <div className={styles.statusBadge}>
        <DismissCircle24Filled style={{ color: tokens.colorPaletteRedForeground1 }} />
        <Badge appearance="tint" color="danger">
          Offline
        </Badge>
      </div>
    );
  };

  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <h1 className={styles.title}>Chat Assistant</h1>
        {getStatusContent()}
      </div>
      <div className={styles.actions}>
        {onClearHistory && (
          <Button
            appearance="subtle"
            icon={<Delete24Regular />}
            onClick={onClearHistory}
            aria-label="Clear chat history"
          >
            Clear History
          </Button>
        )}
      </div>
    </div>
  );
};
