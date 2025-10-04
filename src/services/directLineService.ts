import { DirectLine, ConnectionStatus, Activity, Message } from 'botframework-directlinejs';
import { Observable, Subject } from 'rxjs';

export interface DirectLineConfig {
  token?: string;
  secret?: string;
  webSocket?: boolean;
}

export interface MockDirectLineOptions {
  userId: string;
  userName?: string;
}

export class MockDirectLineService {
  private activitySubject = new Subject<Activity>();
  private connectionStatusSubject = new Subject<ConnectionStatus>();
  private conversationId: string;
  private userId: string;
  private userName: string;

  public activity$: Observable<Activity>;
  public connectionStatus$: Observable<ConnectionStatus>;

  constructor(options: MockDirectLineOptions) {
    this.conversationId = `conv_${Date.now()}`;
    this.userId = options.userId;
    this.userName = options.userName || 'User';

    this.activity$ = this.activitySubject.asObservable();
    this.connectionStatus$ = this.connectionStatusSubject.asObservable();

    setTimeout(() => {
      this.connectionStatusSubject.next(ConnectionStatus.Connecting);
      setTimeout(() => {
        this.connectionStatusSubject.next(ConnectionStatus.Online);
      }, 500);
    }, 100);
  }

  postActivity(activity: Activity): Observable<string> {
    return new Observable((observer) => {
      const activityId = `act_${Date.now()}`;

      setTimeout(() => {
        this.activitySubject.next({
          ...activity,
          id: activityId,
          conversation: { id: this.conversationId }
        });

        setTimeout(() => {
          this.sendMockBotResponse(activity.text || '');
        }, 1000);

        observer.next(activityId);
        observer.complete();
      }, 100);
    });
  }

  private sendMockBotResponse(userMessage: string) {
    this.activitySubject.next({
      type: 'typing',
      from: { id: 'bot', name: 'Assistant' },
      conversation: { id: this.conversationId },
      timestamp: new Date().toISOString()
    });

    setTimeout(() => {
      const response = this.generateMockResponse(userMessage);
      this.activitySubject.next(response);
    }, 1500);
  }

  private generateMockResponse(userMessage: string): Message {
    const message = userMessage.toLowerCase();

    if (message.includes('card') || message.includes('adaptive')) {
      return this.createAdaptiveCardResponse();
    }

    if (message.includes('image') || message.includes('picture')) {
      return this.createImageCardResponse();
    }

    if (message.includes('options') || message.includes('choice')) {
      return this.createChoiceCardResponse();
    }

    if (message.includes('list')) {
      return this.createListCardResponse();
    }

    return this.createTextResponse(userMessage);
  }

  private createTextResponse(userMessage: string): Message {
    return {
      type: 'message',
      id: `msg_${Date.now()}`,
      from: { id: 'bot', name: 'Assistant' },
      conversation: { id: this.conversationId },
      timestamp: new Date().toISOString(),
      text: `You said: "${userMessage}". This is a mock response. Try asking for "card", "image", "options", or "list" to see different adaptive cards.`
    };
  }

  private createAdaptiveCardResponse(): Message {
    return {
      type: 'message',
      id: `msg_${Date.now()}`,
      from: { id: 'bot', name: 'Assistant' },
      conversation: { id: this.conversationId },
      timestamp: new Date().toISOString(),
      attachments: [{
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          type: 'AdaptiveCard',
          version: '1.4',
          body: [
            {
              type: 'TextBlock',
              text: 'Welcome to Adaptive Cards',
              weight: 'Bolder',
              size: 'Large',
              wrap: true
            },
            {
              type: 'TextBlock',
              text: 'Adaptive Cards are platform-agnostic snippets of UI, authored in JSON, that apps and services can openly exchange.',
              wrap: true,
              spacing: 'Medium'
            },
            {
              type: 'Image',
              url: 'https://adaptivecards.io/content/cats/1.png',
              size: 'Medium',
              horizontalAlignment: 'Center'
            },
            {
              type: 'FactSet',
              facts: [
                {
                  title: 'Status:',
                  value: 'Active'
                },
                {
                  title: 'Version:',
                  value: '1.4'
                },
                {
                  title: 'Updated:',
                  value: new Date().toLocaleDateString()
                }
              ]
            }
          ],
          actions: [
            {
              type: 'Action.OpenUrl',
              title: 'Learn More',
              url: 'https://adaptivecards.io'
            },
            {
              type: 'Action.Submit',
              title: 'Submit Feedback',
              data: {
                action: 'feedback',
                rating: 5
              }
            }
          ]
        }
      }]
    };
  }

  private createImageCardResponse(): Message {
    return {
      type: 'message',
      id: `msg_${Date.now()}`,
      from: { id: 'bot', name: 'Assistant' },
      conversation: { id: this.conversationId },
      timestamp: new Date().toISOString(),
      attachments: [{
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          type: 'AdaptiveCard',
          version: '1.4',
          body: [
            {
              type: 'TextBlock',
              text: 'Featured Product',
              weight: 'Bolder',
              size: 'ExtraLarge'
            },
            {
              type: 'ColumnSet',
              columns: [
                {
                  type: 'Column',
                  width: 'auto',
                  items: [
                    {
                      type: 'Image',
                      url: 'https://adaptivecards.io/content/cats/2.png',
                      size: 'Large'
                    }
                  ]
                },
                {
                  type: 'Column',
                  width: 'stretch',
                  items: [
                    {
                      type: 'TextBlock',
                      text: 'Premium Product',
                      weight: 'Bolder',
                      size: 'Large'
                    },
                    {
                      type: 'TextBlock',
                      text: 'High quality product with excellent features',
                      wrap: true,
                      spacing: 'Small'
                    },
                    {
                      type: 'TextBlock',
                      text: '⭐⭐⭐⭐⭐ (4.8/5)',
                      spacing: 'Small'
                    },
                    {
                      type: 'TextBlock',
                      text: '$299.99',
                      size: 'ExtraLarge',
                      color: 'Accent',
                      weight: 'Bolder'
                    }
                  ]
                }
              ]
            }
          ],
          actions: [
            {
              type: 'Action.Submit',
              title: 'Add to Cart',
              data: { action: 'addToCart', productId: '12345' }
            },
            {
              type: 'Action.Submit',
              title: 'View Details',
              data: { action: 'viewDetails', productId: '12345' }
            }
          ]
        }
      }]
    };
  }

  private createChoiceCardResponse(): Message {
    return {
      type: 'message',
      id: `msg_${Date.now()}`,
      from: { id: 'bot', name: 'Assistant' },
      conversation: { id: this.conversationId },
      timestamp: new Date().toISOString(),
      attachments: [{
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          type: 'AdaptiveCard',
          version: '1.4',
          body: [
            {
              type: 'TextBlock',
              text: 'Quick Survey',
              weight: 'Bolder',
              size: 'Large'
            },
            {
              type: 'TextBlock',
              text: 'How would you rate your experience?',
              wrap: true
            },
            {
              type: 'Input.ChoiceSet',
              id: 'rating',
              style: 'expanded',
              choices: [
                {
                  title: '⭐ Poor',
                  value: '1'
                },
                {
                  title: '⭐⭐ Fair',
                  value: '2'
                },
                {
                  title: '⭐⭐⭐ Good',
                  value: '3'
                },
                {
                  title: '⭐⭐⭐⭐ Very Good',
                  value: '4'
                },
                {
                  title: '⭐⭐⭐⭐⭐ Excellent',
                  value: '5'
                }
              ]
            },
            {
              type: 'Input.Text',
              id: 'feedback',
              placeholder: 'Additional comments (optional)',
              isMultiline: true
            }
          ],
          actions: [
            {
              type: 'Action.Submit',
              title: 'Submit',
              data: { action: 'submitSurvey' }
            }
          ]
        }
      }]
    };
  }

  private createListCardResponse(): Message {
    return {
      type: 'message',
      id: `msg_${Date.now()}`,
      from: { id: 'bot', name: 'Assistant' },
      conversation: { id: this.conversationId },
      timestamp: new Date().toISOString(),
      attachments: [{
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          type: 'AdaptiveCard',
          version: '1.4',
          body: [
            {
              type: 'TextBlock',
              text: 'Your Tasks',
              weight: 'Bolder',
              size: 'Large'
            },
            {
              type: 'Container',
              spacing: 'Medium',
              separator: true,
              items: [
                {
                  type: 'ColumnSet',
                  columns: [
                    {
                      type: 'Column',
                      width: 'auto',
                      items: [
                        {
                          type: 'TextBlock',
                          text: '✓',
                          color: 'Good',
                          size: 'Large'
                        }
                      ]
                    },
                    {
                      type: 'Column',
                      width: 'stretch',
                      items: [
                        {
                          type: 'TextBlock',
                          text: 'Review pull requests',
                          weight: 'Bolder'
                        },
                        {
                          type: 'TextBlock',
                          text: 'Due: Today',
                          size: 'Small',
                          isSubtle: true
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'Container',
              spacing: 'Medium',
              separator: true,
              items: [
                {
                  type: 'ColumnSet',
                  columns: [
                    {
                      type: 'Column',
                      width: 'auto',
                      items: [
                        {
                          type: 'TextBlock',
                          text: '○',
                          size: 'Large'
                        }
                      ]
                    },
                    {
                      type: 'Column',
                      width: 'stretch',
                      items: [
                        {
                          type: 'TextBlock',
                          text: 'Update documentation',
                          weight: 'Bolder'
                        },
                        {
                          type: 'TextBlock',
                          text: 'Due: Tomorrow',
                          size: 'Small',
                          isSubtle: true
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'Container',
              spacing: 'Medium',
              separator: true,
              items: [
                {
                  type: 'ColumnSet',
                  columns: [
                    {
                      type: 'Column',
                      width: 'auto',
                      items: [
                        {
                          type: 'TextBlock',
                          text: '○',
                          size: 'Large'
                        }
                      ]
                    },
                    {
                      type: 'Column',
                      width: 'stretch',
                      items: [
                        {
                          type: 'TextBlock',
                          text: 'Team meeting preparation',
                          weight: 'Bolder'
                        },
                        {
                          type: 'TextBlock',
                          text: 'Due: Friday',
                          size: 'Small',
                          isSubtle: true
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          actions: [
            {
              type: 'Action.Submit',
              title: 'Add New Task',
              data: { action: 'addTask' }
            }
          ]
        }
      }]
    };
  }

  end(): void {
    this.connectionStatusSubject.next(ConnectionStatus.Ended);
    this.activitySubject.complete();
    this.connectionStatusSubject.complete();
  }
}

export const createDirectLineService = (
  config: DirectLineConfig,
  useMock: boolean = false,
  mockOptions?: MockDirectLineOptions
): DirectLine | MockDirectLineService => {
  if (useMock && mockOptions) {
    return new MockDirectLineService(mockOptions);
  }

  return new DirectLine({
    token: config.token,
    secret: config.secret,
    webSocket: config.webSocket !== false
  });
};
