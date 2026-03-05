# Musyk

Musyk is a Discord music bot built with TypeScript, Discord.js, and Discord Player.

It works by registering slash commands and event listeners when the bot starts. Users interact with Musyk through Discord commands (such as play, pause, skip, queue, and filters), and the bot processes those interactions to control audio playback in voice channels.

Playback and queue behavior are managed through Discord Player, while embeds and buttons provide interactive status and control messages in text channels. The project also includes a Prisma-based storage layer for persisted server/user settings and supports containerized deployment with Docker.

## Features

- Playback and search across multiple providers through Discord Player
- Queue controls: skip, pause, resume, stop, clear, shuffle, swap, jump, and more
- Playback controls and status embeds
- Slash command support and command deployment workflow
- Prisma-based persistence layer

## Requirements

- Node.js
- A Discord application and bot token
- A configured `.env` file with required variables
- PostgreSQL (or compatible DB target used by your Prisma configuration)

## Docker

The repository includes both `Dockerfile` and `docker-compose.yml`.

### Build and run with Dockerfile

```shell
docker build -t musyk .
docker run --env-file .env -d musyk
```

### Run with Docker Compose

```shell
docker compose up -d
```

## Available Scripts

- `npm start` - Start the bot via `tsx src/bot.ts`
- `npm run deploy-commands` - Deploy slash commands
- `npm run db:generate` - Generate Prisma Client (`src/storage/schema.prisma`)
- `npm run db:push` - Push Prisma schema changes to database
- `npm run lint` - Run ESLint + Prettier check
- `npm run lint:fix` - Auto-fix lint issues
- `npm run type-check` - TypeScript type-check (`tsc --noEmit`)
- `npm run format` - Format source files with Prettier

## Project Structure

- `src/bot.ts` - Application entry point
- `src/commands/` - Slash command implementations
- `src/listeners/` - Discord and player event listeners
- `src/embeds/` - Embed builders and UI components
- `src/storage/` - Prisma schema and storage services
- `src/utils/` - Shared utility functions
