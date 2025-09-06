# CineCircle

A user-friendly, community-oriented app for South Indian movie fans to stay updated with, discuss, and review / rate Tollywood (Telugu), Kollywood (Tamil), Mollywood (Malayalam), and Sandalwood (Kollywood) cinema.

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Supabase account
- Expo CLI

### Running the Application

1. **Setup environment variables:**

   ```bash
   cd backend
   cp .env.example .env
   # Add Supabase connection string to .env
   ```

2. **Install and start the backend:**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start the frontend (in a separate terminal):**

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Test the setup:**
   - Open the Expo app on your phone or simulator / web at http://localhost:8081
   - Click "Ping Backend" to test the backend connection
   - Click "Test Database" to test the Supabase connection

## Architecture

- **Frontend**: React Native with Expo
- **Backend**: Express.js with TypeScript
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma for type-safe database operations
- **Containerization**: Docker Compose
- **Authentication**: Supabase Auth integration

## API Endpoints

- `GET /` - Backend health check
- `GET /api/ping` - Simple ping endpoint
- `GET /api/db-test` - Test Supabase connection via Prisma
- `GET /api/bootcamps` - Get all bootcamps (example endpoint)
- `GET /api/bootcamps/:id` - Get specific bootcamp
- `POST /api/bootcamps` - Create new bootcamp

## Development

### Backend Development

**Key Commands:**

```bash
# Install dependencies
npm install

# Start development server (builds + runs)
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Generate Prisma client (after schema changes)
npx prisma generate

# Sync database schema with Prisma (introspect existing DB)
npx prisma db pull

# Apply schema changes to database (migrations)
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Environment Variables

```bash
DATABASE_URL=    # Supabase connection string (pooled)
DIRECT_URL=      # Supabase direct connection (for migrations)
PORT=3001        # Server port
```
