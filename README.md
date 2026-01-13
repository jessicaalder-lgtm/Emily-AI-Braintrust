# Emily AI - Next.js Web Application

A modern chat interface for Emily AI, built with Next.js, featuring real-time streaming responses, SQLite storage, and Braintrust integration for AI experimentation.

## Features

- **Real-time Streaming**: Smooth, character-by-character streaming of AI responses using Server-Sent Events (SSE)
- **Persistent Storage**: SQLite database with Drizzle ORM for conversation history
- **Modern UI**: Dark-themed chat interface with Tailwind CSS
- **Conversation Management**: Create, view, and delete conversations
- **Braintrust Integration**: Built-in logging and tracing for AI experimentation (optional)
- **Emily's Personality**: Goth-themed AI assistant with interests in heavy metal, B horror movies, and computers

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **ORM**: Drizzle ORM
- **AI**: OpenAI API
- **Observability**: Braintrust

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm
- OpenAI API key

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   BRAINTRUST_API_KEY=your_braintrust_api_key  # Optional
   BRAINTRUST_PROJECT_NAME=jessica-emily-ai
   OPENAI_MODEL=gpt-4-turbo-preview
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Emily-AI-Braintrust/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── chat/           # Streaming chat endpoint
│   │   ├── conversations/  # Conversation CRUD
│   │   └── messages/       # Message history
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── chat/               # Chat UI components
│   └── sidebar/            # Sidebar components
├── hooks/                   # Custom React hooks
│   ├── useChat.ts          # Chat state & streaming
│   ├── useConversations.ts # Conversation management
│   └── useScrollToBottom.ts # Auto-scroll behavior
├── lib/                     # Core business logic
│   ├── ai/                 # AI logic
│   │   ├── completion.ts   # OpenAI integration
│   │   ├── emily.ts        # Emily configuration
│   │   ├── prompts.ts      # System prompts
│   │   └── streaming.ts    # SSE stream handling
│   ├── braintrust/         # Braintrust integration
│   │   ├── client.ts       # Client setup
│   │   ├── logger.ts       # Logging utilities
│   │   └── tracer.ts       # Tracing utilities
│   └── db/                 # Database layer
│       ├── index.ts        # DB connection
│       └── schema.ts       # Schema & queries
├── types/                   # TypeScript definitions
└── public/                  # Static assets
```

## Database

The application uses SQLite for local storage. The database file (`emily.db`) is created automatically in the project root on first run.

### Schema

- **conversations**: Stores conversation metadata
- **messages**: Stores individual messages with role (system/user/assistant)

## Streaming Implementation

The streaming implementation follows best practices for smooth, real-time text display:

1. **No Character Animation**: Text chunks are displayed immediately as received
2. **Server-Sent Events**: Uses SSE for reliable streaming from server to client
3. **State Management**: React state updates happen immediately without artificial delays
4. **Auto-scroll**: Automatically scrolls to follow streaming content

## Braintrust Integration

Braintrust integration is optional and gracefully degrades if not configured:

- **Logging**: Automatic logging of completions with metadata
- **Tracing**: Span-based tracing for performance monitoring
- **Debugging**: Full conversation context for debugging

To use Braintrust:
1. Sign up at [braintrust.dev](https://braintrust.dev)
2. Get your API key
3. Add it to `.env.local`

## Development

### Running Tests

```bash
npm test  # When tests are added
```

### Building for Production

```bash
npm run build
npm start
```

## Customization

### Changing Emily's Personality

Edit `lib/ai/prompts.ts` to customize Emily's system prompt and personality.

### Adjusting Streaming Behavior

Modify `lib/ai/streaming.ts` to change how streaming responses are handled.

### Styling

The app uses Tailwind CSS. Customize styles in:
- `tailwind.config.ts` for theme changes
- `app/globals.css` for global styles
- Individual components for component-specific styles

## Troubleshooting

### Database Issues

If you encounter database errors:
```bash
rm emily.db  # Delete the database
npm run dev  # Restart - DB will be recreated
```

### Streaming Issues

If streaming appears choppy:
1. Check network connection
2. Verify OpenAI API key is valid
3. Check browser console for errors

### API Errors

If you see API errors:
1. Verify `.env.local` has correct API keys
2. Check OpenAI API quota and billing
3. Check browser console and server logs

## Migration Note

This project was migrated from a Slack-based Express application to a standalone Next.js web app in January 2026. The Slack integration has been removed in favor of a direct web interface. The old Slack app code is preserved in git history.

## License

ISC

## Author

Jessica Alder
