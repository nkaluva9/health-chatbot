# Healthcare Chatbot

A modern, production-ready healthcare chatbot application built with React, TypeScript, Azure Bot Framework, and Supabase. This application provides a secure, HIPAA-compliant chat interface with session management, privacy controls, and adaptive card support.

## Features

- **Real-time Chat Interface**: Seamless integration with Azure Bot Framework Direct Line API
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
- Azure Bot Service with Direct Line channel configured

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
