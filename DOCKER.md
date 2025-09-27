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
