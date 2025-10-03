# Docker Implementation

## Architecture

**Development Environment:**

- Backend API container (Node.js + Express + Prisma)
- PostgreSQL container (local database)
- Hot reload for instant code changes
- Persistent data storage

**Production Environment:**

- Optimized backend container (multi-stage build)
- External Supabase PostgreSQL

## Volume Mounting & Hot Reload

**How hot reload works:**

1. Host code: `./backend/src/app.ts`
2. Container path: `/app/src/app.ts`
3. Volume mount: `./backend:/app`
4. Development server: `npx tsx src/server.ts --watch`

**When you edit a file:**

1. File changes on host
2. Volume sync to container
3. tsx detects change
4. Server restarts automatically
5. Changes visible immediately

**Node modules protection:**

- Volume: `/app/node_modules`
- Prevents host overwriting container dependencies
- Ensures consistent environment

## Deployment (trivial)

```bash
# Build prod image
docker build -f backend/Dockerfile.production -t cinecircle-backend .

# Tag
docker tag cinecircle-backend registry.digitalocean.com/your-registry/cinecircle

# Deploy trivially
```
--
### Automatic Sync on Startup

When `SYNC_FROM_PRODUCTION=true` in docker-compose, the container will:

1. **Pull Schema**: Downloads the latest schema from production using `prisma db pull`
2. **Apply Schema**: Resets and applies the schema to the local database
3. **Copy Data**: Uses `pg_dump` to copy all data from production to local
4. **Generate Client**: Regenerates the Prisma client

**After startup, ALL database operations use the local PostgreSQL database.**

### Environment Configuration

#### Development (Docker)
- `DATABASE_URL` → Local PostgreSQL (`postgresql://devuser:devpassword@postgres:5432/devdb`)
- `PROD_DIRECT_URL` → Production Supabase (for syncing only)
- Docker overrides ensure local database is used at runtime

#### Production
- `DATABASE_URL` → Production Supabase
- No sync operations
