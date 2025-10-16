# CineCircle

A user-friendly, community-oriented app for South Indian movie fans to stay updated with, discuss, and review / rate Tollywood (Telugu), Kollywood (Tamil), Mollywood (Malayalam), and Sandalwood (Kollywood) cinema.

## Frontend Quick Start
Enter repo directory then run:

```bash
cd frontend
npm install
npm start
```

## Backend Quick Start

**Requirements:** Docker Desktop

Enter repo directory then run:

```bash
npm start
```

**What happens when you run `npm start`:**
- Spins up a PostgreSQL database container
- Starts the backend development container
- Automatically pulls the latest schema from production
- Copies production data to your local database
- Starts the API server at http://localhost:3001
- Starts Prisma Studio at http://localhost:5555

**Test it works:** http://localhost:3001/api/ping  
**Stop everything:** `npm stop`

## Commands Reference

### **Development**

```bash
npm start          # Start development environment (backend + database)
npm stop           # Stop all containers and clean up
npm run shell      # Get shell inside backend container for running commands
npm run logs       # View real-time container logs
npm run clean      # Clean restart if things break
```

## **‼️Important‼️:** 
All terminal actions (database commands, tests, etc.) should be run **inside the container shell** using `npm run shell` first.

### **Testing**

```bash
npm test              # Run all tests in development environment
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### **Code Quality**

```bash
npm run lint    # Check code style and quality
npm run format  # Auto-format code with Prettier
npm run build   # Build TypeScript to JavaScript
```

### **Database Operations**

All database commands must be run inside the container shell:

```bash
# First, get into the container:
npm run shell

# Then run database commands:
npm run db:sync          # Re-sync schema and data from production
npx prisma studio        # Open Prisma Studio at http://localhost:5555
npx prisma db push       # Push schema changes to local database
npx prisma generate      # Regenerate Prisma client
```

## Database usage

**In development, you ONLY use local PostgreSQL - production is never touched (😅):**

- **Local Database**: Runs in Docker container (`postgres:5432`)
- **Production Database**: Completely separate, read-only for development
- **Auto-Sync on Startup**: Schema and data automatically pulled from production when you `npm start`
- **Manual Re-Sync**: Run `npm run db:sync` inside container to sync again

### **Schema Changes Workflow:**

```bash
# 1. Edit backend/prisma/schema.prisma

# 2. Get into container shell
npm run shell

# 3. Push to local database
npx prisma db push

# 4. Generate new Prisma client
npx prisma generate

# 5. Test your changes
npm test

# 6. When ready, deploy changes (separate process)
```
