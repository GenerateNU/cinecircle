#!/bin/sh
set -e

echo "Starting Backend Development Environment..."

# Check if we should sync from production
if [ "${SYNC_FROM_PRODUCTION:-true}" = "true" ]; then
  echo "Syncing schema from production..."
  
  # Pull schema from production (only if production env vars are available)
  if [ -n "$PRODUCTION_DATABASE_URL" ]; then
    echo "Pulling schema from production..."
    DATABASE_URL="$PRODUCTION_DATABASE_URL" npx prisma db pull --force
  else
    echo "No production URL found, using existing schema"
  fi
  
  # Push schema to development database
  echo "Applying schema to development database..."
  npx prisma db push --force-reset
  
  # Generate Prisma client
  echo "Generating Prisma client..."
  npx prisma generate
  
  # Seed database (Prisma's automatic seeding)
  echo "Seeding database with development data..."
  npx prisma db seed
  
  echo "Database setup complete!"
else
  echo "Skipping production sync (SYNC_FROM_PRODUCTION=false)"
  
  # Just ensure the database is migrated and seeded
  echo "Ensuring database is up to date..."
  npx prisma db push
  npx prisma generate
  
  # Only seed if database is empty
  echo "Seeding database if needed..."
  npx prisma db seed 2>/dev/null || echo "Database already seeded or seed failed"
fi

echo ""
echo "Starting development server..."
echo "Database: Ready with development data"
echo "API: http://localhost:3001"
echo "Prisma Studio: http://localhost:5555"
echo ""

# Start the application
exec "$@"
