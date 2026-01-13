# Emily AI - Web Application

A modern chat interface for Emily AI, built with Next.js, featuring real-time streaming responses, SQLite storage, and Braintrust integration for AI experimentation.

## About Emily

Emily is a goth-themed AI assistant with interests in heavy metal, B horror movies, and computers. She provides helpful, engaging conversation while maintaining her unique personality.

## Project Structure

This repository contains:
- **`emily-ai-webapp/`** - The main Next.js web application

## Quick Start

Navigate to the webapp directory and follow the setup instructions:

```bash
cd emily-ai-webapp
npm install
cp .env.local.example .env.local
# Edit .env.local with your API keys
npm run dev
```

See [emily-ai-webapp/README.md](./emily-ai-webapp/README.md) for complete installation and usage instructions.

## Features

- 💬 Real-time streaming chat interface with Server-Sent Events
- 🗄️ SQLite-based conversation storage with Drizzle ORM
- 🎨 Dark-themed responsive UI built with Tailwind CSS
- 🔍 Braintrust integration for AI observability and experimentation
- 🤖 Emily's distinct personality preserved and refined
- 📱 Mobile-responsive design
- ⚡ Fast, efficient streaming with no artificial delays

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **ORM**: Drizzle ORM
- **AI**: OpenAI API
- **Observability**: Braintrust

## Migration Note

This project was migrated from a Slack-based Express application to a standalone Next.js web app in January 2026. The Slack integration has been removed in favor of a direct web interface. The old Slack app code is preserved in git history.

## Author

Jessica Alder

## License

ISC
