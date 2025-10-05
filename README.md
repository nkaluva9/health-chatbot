# Healthcare Chatbot

[![Build Status](https://img.shields.io/github/actions/workflow/status/nkaluva9/healthcare-chatbot/deploy.yml?branch=main)](https://github.com/nkaluva9/healthcare-chatbot/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deployment](https://img.shields.io/badge/Deployed-GitHub%20Pages-success)](https://nkaluva9.github.io/healthcare-chatbot/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3+-61dafb.svg)](https://reactjs.org/)

A modern, production-ready healthcare chatbot application built with React, TypeScript, Azure Bot Framework, and Supabase. This application provides a secure, HIPAA-compliant chat interface with session management, privacy controls, and adaptive card support.

## Table of Contents

- [Quick Start](#quick-start)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Scripts](#scripts)
- [Testing](#testing)
- [Security Features](#security-features)
- [Edge Functions](#edge-functions)
- [Switching Between Mock and Real Azure Bot Service](#switching-between-mock-and-real-azure-bot-service)
- [Deployment](#deployment)
- [Accessibility Statement](#accessibility-statement)
- [Contributing](#contributing)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Code of Conduct](#code-of-conduct)
- [Changelog](#changelog)
- [License](#license)
- [Support](#support)
- [Acknowledgments](#acknowledgments)

## Quick Start

Get started with the Healthcare Chatbot in minutes:

```bash
# Clone the repository
git clone https://github.com/nkaluva9/healthcare-chatbot.git
cd healthcare-chatbot

# Install dependencies
npm install

# Set up environment variables (copy and edit)
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server (runs in mock mode by default)
npm run dev
```

**Live Demo**: [https://nkaluva9.github.io/healthcare-chatbot/](https://nkaluva9.github.io/healthcare-chatbot/) *(if deployed)*

**Note**: The app runs in mock mode by default, which doesn't require Azure Bot Service setup. Perfect for testing and development!

For full setup instructions including database configuration, see [Getting Started](#getting-started).

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

## Testing

The project includes several quality assurance tools to ensure code quality and correctness:

### Running Tests

Currently, the project uses the following testing and validation tools:

**Linting**
```bash
npm run lint
```
Runs ESLint to check code style and catch common errors. ESLint is configured with TypeScript support and React-specific rules.

**Type Checking**
```bash
npm run typecheck
```
Runs TypeScript compiler in no-emit mode to verify type safety across the codebase without generating output files.

**Build Verification**
```bash
npm run build
```
Verifies that the application builds successfully for production. The build process includes:
- TypeScript compilation
- Vite bundling and optimization
- Asset processing

**Preview Production Build**
```bash
npm run preview
```
Serves the production build locally for testing before deployment.

### Continuous Integration

The project includes GitHub Actions workflows that automatically run on pull requests:
- Linting checks
- Type checking
- Build verification

See `.github/workflows/deploy.yml` for the complete CI/CD configuration.

### Code Quality

The project enforces code quality through:
- **ESLint**: Configured for TypeScript and React best practices
- **TypeScript**: Strict type checking enabled
- **React Hooks Rules**: Validates proper hook usage
- **Prettier Integration**: Code formatting (via ESLint)

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

## Accessibility Statement

The Healthcare Chatbot is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.

### Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Compatible**: Semantic HTML and ARIA labels for assistive technologies
- **Color Contrast**: WCAG 2.1 AA compliant color contrast ratios
- **Focus Indicators**: Clear visual focus states for all interactive elements
- **Responsive Design**: Adapts to various screen sizes and zoom levels
- **Fluent UI Components**: Built with Microsoft's accessible Fluent UI component library

### Healthcare-Specific Considerations

- **Clear Privacy Notices**: Prominent privacy consent modal with explicit consent options
- **Data Control**: Users can manage data retention settings and export their data
- **Simple Language**: Medical information presented in clear, understandable terms
- **No Sensitive Data Collection**: Explicit guidance on what information NOT to share
- **Emergency Disclaimers**: Clear statements that the chatbot is not for medical emergencies

### Feedback and Support

We welcome feedback on the accessibility of the Healthcare Chatbot. If you encounter accessibility barriers, please let us know via:
- GitHub Issues: [Report an accessibility issue](https://github.com/nkaluva9/healthcare-chatbot/issues)
- Include "Accessibility" in the issue title

We aim to respond to accessibility feedback within 5 business days.

### Standards and Compliance

This application strives to conform to:
- Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
- Section 508 of the Rehabilitation Act
- Healthcare-specific accessibility best practices

**Note**: While we strive for full accessibility, some third-party components (Azure Bot Framework, Supabase UI) may have their own accessibility considerations.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issue Reporting Guidelines

We appreciate your help in making this project better! When reporting issues, please follow these guidelines:

### Before Submitting an Issue

1. **Search Existing Issues**: Check if your issue has already been reported
2. **Check Documentation**: Review the README and [project wiki](https://github.com/nkaluva9/healthcare-chatbot/wiki)
3. **Try Latest Version**: Ensure you're using the latest version from the main branch

### Bug Reports

When reporting a bug, please include:

**Required Information:**
- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: 
  - Node.js version (`node --version`)
  - npm version (`npm --version`)
  - Operating System
  - Browser (if applicable)

**Optional but Helpful:**
- Screenshots or screen recordings
- Error messages or console logs
- Code snippets demonstrating the issue
- Whether the issue occurs in mock mode, production mode, or both

**Example:**
```markdown
**Bug**: Chat messages not saving to database

**Steps to Reproduce:**
1. Start app with `npm run dev`
2. Send a message in the chat
3. Refresh the page
4. Previous messages are not displayed

**Expected**: Messages should persist after refresh
**Actual**: Messages disappear after refresh

**Environment:**
- Node.js: v18.17.0
- npm: 9.8.1
- OS: Ubuntu 22.04
- Browser: Chrome 119
```

### Feature Requests

For new features, please include:
- **Use Case**: Describe the problem this feature would solve
- **Proposed Solution**: How you envision the feature working
- **Alternatives Considered**: Other solutions you've thought about
- **Additional Context**: Screenshots, mockups, or examples

### Security Vulnerabilities

**DO NOT** report security vulnerabilities through public GitHub issues. Instead:
1. Email the maintainers directly (see package.json for contact info)
2. Include "SECURITY" in the subject line
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

### Healthcare Data Privacy Issues

If you discover an issue related to healthcare data privacy or HIPAA compliance:
1. Report it as a security vulnerability (privately)
2. Do NOT include any real patient data or PHI in the report
3. Use hypothetical examples only

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

**Summary:**
- Be respectful and inclusive
- Welcome diverse perspectives
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

**Healthcare Context:**
Given the healthcare nature of this project, we're especially mindful of:
- Patient privacy and data protection
- Ethical considerations in healthcare technology
- Accessibility for users with disabilities
- Clear communication about medical information limitations

Report unacceptable behavior to the project maintainers via GitHub Issues or email.

*Note: A full CODE_OF_CONDUCT.md file will be added to the repository root following the [Contributor Covenant](https://www.contributor-covenant.org/) standard.*

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes, new features, bug fixes, and breaking changes in each release.

**Latest Updates:**
- Check the [Releases page](https://github.com/nkaluva9/healthcare-chatbot/releases) for version history
- Follow [GitHub commits](https://github.com/nkaluva9/healthcare-chatbot/commits/main) for recent changes

*Note: A CHANGELOG.md file following [Keep a Changelog](https://keepachangelog.com/) format will be maintained starting with the next release.*

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- **GitHub Issues**: [Report bugs or request features](https://github.com/nkaluva9/healthcare-chatbot/issues)
- **Documentation**: [Project Wiki](https://github.com/nkaluva9/healthcare-chatbot/wiki) *(to be populated)*
- **Discussions**: [GitHub Discussions](https://github.com/nkaluva9/healthcare-chatbot/discussions) for questions and community support

### External Documentation

**Azure Bot Framework:**
- [Azure Bot Service Documentation](https://docs.microsoft.com/en-us/azure/bot-service/)
- [Direct Line API Reference](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-concepts)
- [Adaptive Cards Documentation](https://adaptivecards.io/)

**Supabase:**
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

**React & TypeScript:**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

### Getting Help

1. **Check Documentation First**: Review this README and linked resources
2. **Search Issues**: Someone may have already solved your problem
3. **Ask in Discussions**: For general questions and usage help
4. **Open an Issue**: For bugs or feature requests (see [Issue Reporting Guidelines](#issue-reporting-guidelines))

## Acknowledgments

- Azure Bot Framework for chat infrastructure
- Supabase for backend services
- Fluent UI for component library
- The open-source community
