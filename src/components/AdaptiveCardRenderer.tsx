import { useEffect, useRef } from 'react';
import * as AdaptiveCards from 'adaptivecards';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    maxWidth: '100%',
    '& .ac-container': {
      fontFamily: tokens.fontFamilyBase,
    },
    '& .ac-textBlock': {
      color: tokens.colorNeutralForeground1,
      fontSize: tokens.fontSizeBase300,
      lineHeight: tokens.lineHeightBase300,
    },
    '& .ac-pushButton': {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralForegroundOnBrand,
      border: 'none',
      borderRadius: tokens.borderRadiusMedium,
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
      fontSize: tokens.fontSizeBase300,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: tokens.colorBrandBackgroundHover,
      },
      '&:active': {
        backgroundColor: tokens.colorBrandBackgroundPressed,
      },
    },
    '& .ac-input': {
      backgroundColor: tokens.colorNeutralBackground1,
      border: `1px solid ${tokens.colorNeutralStroke1}`,
      borderRadius: tokens.borderRadiusMedium,
      padding: tokens.spacingVerticalS,
      fontSize: tokens.fontSizeBase300,
      color: tokens.colorNeutralForeground1,
      '&:focus': {
        outline: `2px solid ${tokens.colorBrandStroke1}`,
        borderColor: tokens.colorBrandStroke1,
      },
    },
    '& .ac-container.ac-selectable:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

export interface AdaptiveCardRendererProps {
  card: any;
  onAction?: (action: any) => void;
}

export const AdaptiveCardRenderer = ({ card, onAction }: AdaptiveCardRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const styles = useStyles();

  useEffect(() => {
    if (!containerRef.current || !card) return;

    const adaptiveCard = new AdaptiveCards.AdaptiveCard();

    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
      fontFamily: tokens.fontFamilyBase,
      spacing: {
        small: 8,
        default: 12,
        medium: 16,
        large: 20,
        extraLarge: 24,
        padding: 12,
      },
      separator: {
        lineThickness: 1,
        lineColor: tokens.colorNeutralStroke2,
      },
      imageSizes: {
        small: 40,
        medium: 80,
        large: 160,
      },
      containerStyles: {
        default: {
          backgroundColor: tokens.colorNeutralBackground1,
          foregroundColors: {
            default: {
              default: tokens.colorNeutralForeground1,
              subtle: tokens.colorNeutralForeground2,
            },
            accent: {
              default: tokens.colorBrandForeground1,
              subtle: tokens.colorBrandForeground2,
            },
            good: {
              default: tokens.colorPaletteGreenForeground1,
              subtle: tokens.colorPaletteGreenForeground2,
            },
            warning: {
              default: tokens.colorPaletteYellowForeground1,
              subtle: tokens.colorPaletteYellowForeground2,
            },
            attention: {
              default: tokens.colorPaletteRedForeground1,
              subtle: tokens.colorPaletteRedForeground2,
            },
          },
        },
      },
      actions: {
        actionsOrientation: 'horizontal',
        actionAlignment: 'left',
        buttonSpacing: 8,
        maxActions: 5,
        spacing: 'default',
      },
    });

    adaptiveCard.onExecuteAction = (action) => {
      if (onAction) {
        onAction({
          type: action.getJsonTypeName(),
          title: action.title,
          url: (action as any).url,
          data: (action as any).data,
        });
      }
    };

    try {
      adaptiveCard.parse(card);
      const renderedCard = adaptiveCard.render();

      if (renderedCard && containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderedCard);
      }
    } catch (error) {
      console.error('Error rendering adaptive card:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = '<p>Error rendering card</p>';
      }
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [card, onAction]);

  return <div ref={containerRef} className={styles.container} />;
};
