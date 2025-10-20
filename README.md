# CineCircle

A user-friendly, community-oriented app for South Indian movie fans to stay updated with, discuss, and review / rate Tollywood (Telugu), Kollywood (Tamil), Mollywood (Malayalam), and Sandalwood (Kollywood) cinema.

## Quick Start

**Requirements:** Docker Desktop

**All commands run from root directory.** Run `npm run` to see all available commands.

### Dependencies Setup
```bash
npm run install:all     # Install all for both backend and frontend
```

### Start Development
```bash
npm run backend:start   # Start backend (Docker containers)
npm run frontend:start  # Start frontend (Expo) - in separate terminal
```

**Backend starts:**
- Local PostgreSQL database container (postgres:5432)
- Backend API server at http://localhost:3001
- Prisma Studio at http://localhost:5555
- Auto-syncs schema/data from production (with SYNC_FROM_PRODUCTION=true in .env file)

**Test backend works:** http://localhost:3001/api/ping

**Stop backend:**
```bash
npm run backend:stop
```

## Available Commands

Run `npm run` from root to see all commands. Key ones:

### Backend (Docker)
```bash
npm run backend:start          # Start containers
npm run backend:stop           # Stop containers
npm run backend:logs           # View logs
npm run backend:shell          # Shell into container
npm run backend:test           # Run tests
npm run backend:lint           # Lint code
npm run backend:clean          # Full cleanup
```

### Database Operations

Get into container shell first, then run database commands:

```bash
npm run backend:shell

# Inside container:
npm run db:sync          # Re-sync from production
npx prisma studio        # Open Prisma Studio
npx prisma db push       # Push schema changes
npx prisma generate      # Regenerate client
```

### Frontend (Expo)
```bash
npm run frontend:start         # Start Expo dev server
npm run frontend:android       # Run on Android
npm run frontend:ios           # Run on iOS
npm run frontend:clean         # Clean rebuild
```

## Database Usage

**In development, you ONLY use local PostgreSQL - production is never touched (😅):**

- **Local Database**: Runs in Docker container (`postgres:5432`)
- **Production Database**: Completely separate, read-only for development
- **Manual Re-Sync**: Run `db:sync` inside container to sync again

### Schema Changes Workflow

```bash
# 1. Edit backend/prisma/schema.prisma

# 2. Get into container shell
npm run backend:shell

# 3. Push to local database
npx prisma db push

# 4. Generate new Prisma client
npx prisma generate

# 5. Test your changes
npm test

# 6. When ready, deploy changes (separate process)
```
