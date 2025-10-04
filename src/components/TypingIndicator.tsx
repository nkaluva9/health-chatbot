import { makeStyles, tokens, Avatar } from '@fluentui/react-components';
import { Bot24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
  avatar: {
    flexShrink: 0,
  },
  bubble: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusLarge,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: tokens.colorNeutralForeground3,
    animationName: {
      '0%, 60%, 100%': {
        transform: 'translateY(0)',
      },
      '30%': {
        transform: 'translateY(-10px)',
      },
    },
    animationDuration: '1.4s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
});

export const TypingIndicator = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Avatar
        className={styles.avatar}
        icon={<Bot24Regular />}
        color="colorful"
        size={36}
      />
      <div className={styles.bubble}>
        <div className={`${styles.dot} ${styles.dot1}`} />
        <div className={`${styles.dot} ${styles.dot2}`} />
        <div className={`${styles.dot} ${styles.dot3}`} />
      </div>
    </div>
  );
};
