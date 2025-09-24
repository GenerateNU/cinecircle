# CineCircle

A user-friendly, community-oriented app for South Indian movie fans to stay updated with, discuss, and review / rate Tollywood (Telugu), Kollywood (Tamil), Mollywood (Malayalam), and Sandalwood (Kollywood) cinema.

## Quick Start

**Requirements:** Docker Desktop

Enter repo directory then run:

```bash
npm start
```

**Test it works:** http://localhost:3001/api/ping  
**Stop everything:** `npm stop`

## Commands Reference

### **Development**

```bash
npm start          # Start development environment (backend + database)
npm stop           # Stop all containers and clean up
npm run shell      # Get shell inside backend container for debugging
npm run logs       # View real-time container logs
npm run clean      # Clean restart if things break
```

### **Testing**

```bash
npm test           # Run all tests in development environment
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### **Code Quality**

```bash
npm run lint       # Check code style and quality
npm run format     # Auto-format code with Prettier
npm run build      # Build TypeScript to JavaScript
```

### **Database Operations**

```bash
# Open database GUI (accessible from your browser):
npm run shell             # Get container shell, then:
npx prisma studio         # Start Prisma Studio
# Then visit: http://localhost:5555 in your browser

# Other database commands:
npx prisma db push        # Push schema changes to database
npx prisma generate       # Regenerate Prisma client
npm run db:seed           # Seed database with sample data
npm run db:reset          # Reset database completely
```

## 🗄️ Database: Local PostgreSQL Only

**In development, you ONLY use local PostgreSQL:**

- **Local Database**: Runs in Docker container (`postgres:5432`)
- **Production Database**: Completely separate, never touched from development
- **Schema Sync**: Manual - you push schema changes when ready

### **How It Works:**

1. **Development**: Local PostgreSQL container with your own data
2. **Schema**: Sync from production with `npx prisma db pull`
3. **Data**: Seed with `npm run db:seed` or add manually via Prisma Studio
4. **Testing**: Uses same local database, resets data between test runs

### **First Time Setup:**

```bash
npm start                     # Start containers
npm run shell                 # Get into container
npx prisma db pull            # Pull latest schema from production
npm run db:setup              # Push schema + seed data
```

### **Interacting with Local Database:**

```bash
# Start development environment
npm start

# Open database GUI in browser
npm run shell
npx prisma studio  # Opens localhost:5555

# View/edit data, run queries, etc.
# All changes stay local - production untouched
```

### **Schema Changes Workflow:**

```bash
# 1. Edit backend/prisma/schema.prisma
# 2. Push to local database
npm run shell
npx prisma db push

# 3. Generate new Prisma client
npx prisma generate

# 4. Test your changes
npm test

# 5. When ready, deploy to production (separate process)
```

## Project Structure

```
cinecircle/
├── backend/                   # Node.js API
│   ├── src/                   # Source code
│   ├── prisma/                # Database schema & migrations
│   ├── .env                   # Local development config
│   ├── .env.production        # Production config (for deployment)
│   └── Dockerfile.production  # Production Docker image
├── frontend/                  # React Native App (coming soon)
└── docker-compose.dev.yml     # Development environment
```

## Environment Files

- **`.env`**: Local development (points to Docker PostgreSQL)
- **`.env.production`**: Production deployment (points to Supabase)

**Development uses Docker PostgreSQL, Production uses Supabase.** Never mix them.
