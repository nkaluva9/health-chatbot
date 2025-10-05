# Healthcare Chatbot

A modern, production-ready healthcare chatbot application built with React, TypeScript, Azure Bot Framework, and Supabase. This application provides a secure, HIPAA-compliant chat interface with session management, privacy controls, and adaptive card support.

## Screenshots

### Main Chat Interface with Session History
![Chat Interface](public/screenshots/Screenshot%202025-10-05%20070112.png)

The main interface showcases a sophisticated, user-friendly design with:
- **Persistent Session History**: Left sidebar displays a comprehensive list of all past conversations, each with descriptive titles, message counts, and timestamps for easy reference
- **Seamless Session Navigation**: Click any previous conversation to instantly resume where you left off, maintaining full context and conversation flow
- **Smart Organization**: Toggle between Active and Archived tabs to keep your workspace organized and focused
- **Quick Access Controls**: Start new conversations instantly with the prominent "New Conversation" button
- **Intelligent Search**: Quickly locate specific conversations using the integrated search functionality
- **Privacy at Your Fingertips**: Access comprehensive privacy settings directly from the sidebar footer
- **Rich Content Display**: Adaptive cards render beautifully in the main chat area, presenting healthcare information with interactive elements and professional styling

### Privacy & Data Settings
![Privacy Settings](public/screenshots/Screenshot%202025-10-05%20070156.png)

Comprehensive privacy controls allowing users to:
- **Data Retention Period**: Choose to keep conversations for 30, 60, or 90 days
- **Maximum Sessions**: Control how many conversation sessions to store (up to 100)
- **Auto-Archive**: Automatically archive old conversations when limits are reached
- **Settings Summary**: Clear overview of current privacy configuration
- **Encrypted Storage**: All data is encrypted and secure

### Adaptive Cards in Action
![Adaptive Cards](public/screenshots/Screenshot%202025-10-05%20070249.png)

Interactive adaptive cards displaying:
- **Welcome Cards**: Introduction to the chatbot with version information and status
- **Task Cards**: Interactive task lists with checkboxes and due dates
- **Action Buttons**: "Learn More" and "Submit Feedback" for user engagement
- **Rich Formatting**: Cards with icons, structured data, and professional styling
- **Healthcare Content**: Tailored responses for medical queries and recommendations

## Features

- **Real-time Chat Interface**: Seamless integration with Azure Bot Framework Direct Line API
- **Mock Direct Line Service**: Built-in testing support with MockDirectLineService for adaptive card UI responses without requiring Azure Bot Framework connection
- **Session History**: Track and manage multiple chat sessions
- **Privacy Controls**: Built-in consent management and data retention settings
- **Adaptive Cards**: Rich, interactive card rendering for enhanced user experience
- **Secure Backend**: Supabase database with Row Level Security (RLS) policies
- **Responsive Design**: Modern, accessible UI built with Fluent UI and Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Fluent UI React Components, Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Chat Integration**: Azure Bot Framework Direct Line
- **Backend**: Supabase (PostgreSQL database)
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- Azure Bot Service with Direct Line channel configured (optional - can use MockDirectLineService for testing)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nkaluva9/healthcare-chatbot.git
cd healthcare-chatbot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase Database

The database migrations are located in `supabase/migrations/`. The schema includes:

- `chat_sessions`: Stores chat session metadata
- `chat_messages`: Stores individual messages
- `user_chat_preferences`: Stores user privacy and retention preferences

#### Apply Migrations

**Option A: Using Supabase CLI (Recommended)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations to database
supabase db push
```

**Option B: Using Supabase Dashboard**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy the contents of `supabase/migrations/20251005102112_create_initial_schema.sql`
5. Paste and click **Run**

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Azure Bot Framework Direct Line
VITE_DIRECTLINE_SECRET=your-directline-secret-here
```

**Getting Supabase Credentials:**
1. Go to Project Settings → API
2. Copy your Project URL and anon/public key

**Getting Direct Line Secret:**
1. Go to Azure Portal → Your Bot Resource
2. Navigate to Channels → Direct Line
3. Copy one of the secret keys

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### Testing Mode

The application includes a MockDirectLineService for testing adaptive card UI responses without connecting to Azure Bot Framework. This is useful for:

- Local development and testing
- Demonstrating adaptive card functionality
- Frontend development without backend dependencies

To use the mock service, the application will automatically detect if Direct Line credentials are not configured and provide sample adaptive card responses.

### 6. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Project Structure

```
healthcare-chatbot/
├── src/
│   ├── components/          # React components
│   │   ├── ChatContainer.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── SessionHistorySidebar.tsx
│   │   ├── PrivacyConsentModal.tsx
│   │   ├── DataRetentionSettings.tsx
│   │   ├── AdaptiveCardRenderer.tsx
│   │   └── TypingIndicator.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useDirectLineChat.ts
│   ├── services/           # API and business logic
│   │   ├── directLineService.ts
│   │   └── chatHistoryService.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── chat.ts
│   │   └── database.ts
│   ├── lib/                # Third-party library configurations
│   │   └── supabase.ts
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── supabase/
│   ├── migrations/         # Database migrations
│   └── functions/          # Edge functions
├── public/                 # Static assets
├── .env                    # Environment variables
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Project dependencies

```

## Database Schema

### chat_sessions
Stores chat session information with automatic cleanup for expired sessions.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | text | Anonymous user identifier |
| started_at | timestamptz | Session start time |
| last_message_at | timestamptz | Last activity timestamp |
| is_active | boolean | Active session flag |

### chat_messages
Stores individual chat messages with sender information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| session_id | uuid | Foreign key to chat_sessions |
| content | text | Message content |
| sender | text | 'user' or 'bot' |
| timestamp | timestamptz | Message timestamp |
| metadata | jsonb | Additional message data |

### user_chat_preferences
Stores user privacy and data retention preferences.

| Column | Type | Description |
|--------|------|-------------|
| user_id | text | Primary key, anonymous user ID |
| consent_given | boolean | Privacy consent status |
| data_retention_days | integer | Data retention period |
| created_at | timestamptz | Preference creation time |
| updated_at | timestamptz | Last update time |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Security Features

- Row Level Security (RLS) enabled on all tables
- Anonymous user identification without authentication
- Configurable data retention periods
- Privacy consent management
- Automatic session cleanup via Edge Functions

## Edge Functions

### cleanup-expired-sessions
Automatically removes chat sessions and messages older than the user's configured retention period. Can be triggered via cron job or manual invocation.

## Switching Between Mock and Real Azure Bot Service

This application supports two modes of operation:

### Mock Mode (Default - No Azure Required)

The application currently runs in **Mock Mode** by default, which simulates bot responses without requiring an Azure Bot Service connection. This is ideal for:

- Local development and testing
- Demonstrating adaptive card UI functionality
- Frontend development without backend dependencies
- Quick prototyping and demos

**Current Configuration** (`src/App.tsx`):
```typescript
<ChatContainer
  useMock={true}                    // Mock mode enabled
  userId="demo_user_001"
  enablePersistence={true}
/>
```

The Mock Direct Line Service provides realistic simulated responses including:
- Text responses echoing user input
- Adaptive cards (triggered by keywords: "card", "image", "options", "list")
- Interactive card elements (buttons, inputs, choices)
- Typing indicators and connection status simulation

### Production Mode (Azure Bot Service)

To connect to a real Azure Bot Framework bot with Direct Line, follow these steps:

#### Step 1: Get Your Azure Direct Line Secret

1. Log in to [Azure Portal](https://portal.azure.com)
2. Navigate to your **Bot Service** resource
3. Go to **Channels** in the left menu
4. Click on **Direct Line** channel
5. Click **Show** next to one of the secret keys
6. Copy the secret key

#### Step 2: Configure Environment Variable

Add your Direct Line secret to the `.env` file:

```env
# Supabase Configuration (already configured)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Azure Bot Framework Direct Line Secret
VITE_BOT_DIRECT_LINE_SECRET=your_actual_directline_secret_here
```

**Important Notes:**
- The variable must be prefixed with `VITE_` to be accessible in the frontend
- Never commit your `.env` file with real secrets to version control
- The `.gitignore` file already excludes `.env` from git

#### Step 3: Update Application Configuration

Modify `src/App.tsx` to use the real Direct Line service:

```typescript
function App() {
  return (
    <ChatContainer
      directLineToken={import.meta.env.VITE_BOT_DIRECT_LINE_SECRET}  // Use environment variable
      useMock={false}                                                 // Disable mock mode
      userId="demo_user_001"
      enablePersistence={true}
    />
  );
}

export default App;
```

#### Step 4: Restart Development Server

After making these changes, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### How It Works

The application uses the `createDirectLineService` factory function (`src/services/directLineService.ts`) that determines which service to use:

```typescript
export const createDirectLineService = (
  config: DirectLineConfig,
  useMock: boolean = false,
  mockOptions?: MockDirectLineOptions
): DirectLine | MockDirectLineService => {
  if (useMock && mockOptions) {
    return new MockDirectLineService(mockOptions);  // Returns mock service
  }

  return new DirectLine({                           // Returns real Azure Direct Line
    token: config.token,
    secret: config.secret,
    webSocket: config.webSocket !== false
  });
};
```

### Comparison: Mock vs Production Mode

| Feature | Mock Mode | Production Mode |
|---------|-----------|----------------|
| **Setup Required** | None | Azure Bot Service + Direct Line |
| **Responses** | Simulated | Real bot responses |
| **Adaptive Cards** | Demo cards | Bot-generated cards |
| **API Calls** | None | Direct Line API |
| **Best For** | Development, demos | Production use |
| **Cost** | Free | Azure charges apply |

### Troubleshooting

**Problem**: "Cannot connect to bot" or connection errors

**Solutions**:
1. Verify your Direct Line secret is correct in `.env`
2. Ensure the secret is active in Azure Portal
3. Check that your bot is running and healthy in Azure
4. Verify the environment variable name matches: `VITE_BOT_DIRECT_LINE_SECRET`
5. Confirm you restarted the dev server after changing `.env`

**Problem**: Application still shows mock responses

**Solutions**:
1. Verify `useMock={false}` in `App.tsx`
2. Check that `directLineToken` prop is being passed
3. Clear browser cache and reload
4. Check browser console for any errors

## Deployment

The application can be deployed to various platforms:

- **Netlify**: Configuration provided in `netlify.toml`
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Workflow available in `.github/workflows/`

See `DEPLOYMENT_GUIDE.txt` for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- GitHub Issues: https://github.com/nkaluva9/healthcare-chatbot/issues
- Documentation: See project wiki

## Acknowledgments

- Azure Bot Framework for chat infrastructure
- Supabase for backend services
- Fluent UI for component library
- The open-source community
