#!/bin/sh
set -e

echo "Starting Backend Development Environment..."

# Save the local DATABASE_URL for later use
LOCAL_DATABASE_URL="$DATABASE_URL"
LOCAL_DIRECT_URL="$DIRECT_URL"

# Check if we should sync from production
if [ "${SYNC_FROM_PRODUCTION:-false}" = "true" ]; then
  echo "=========================================="
  echo "Syncing from Production Database"
  echo "=========================================="
  
  # Pull schema from production using PROD_DIRECT_URL
  if [ -n "$PROD_DIRECT_URL" ]; then
    echo "[1/4] Pulling schema from production..."
    DATABASE_URL="$PROD_DIRECT_URL" DIRECT_URL="$PROD_DIRECT_URL" npx prisma db pull --force
    echo "Schema pulled from production"
    
    echo "[1.5/4] Sanitizing schema for local PostgreSQL..."
    # Replace Supabase-specific functions with standard PostgreSQL equivalents
    sed -i.bak \
      -e 's/@default(dbgenerated("auth\\.uid()"))/@default(uuid())/g' \
      -e 's/@default(dbgenerated("auth.uid()"))/@default(uuid())/g' \
      -e 's/@default(dbgenerated("gen_random_uuid()"))/@default(uuid())/g' \
      -e 's/@default(dbgenerated("uuid_generate_v4()"))/@default(uuid())/g' \
      -e 's/@default(dbgenerated("lower((identity_data ->> .email.::text))"))//g' \
      -e 's/@default(dbgenerated("LEAST(email_confirmed_at, phone_confirmed_at)"))//g' \
      prisma/schema.prisma
    # Remove backup file
    rm -f prisma/schema.prisma.bak
    echo "Schema sanitized"
    
    echo "[2/4] Applying schema to local database..."
    DATABASE_URL="$LOCAL_DATABASE_URL" DIRECT_URL="$LOCAL_DIRECT_URL" npx prisma db push --force-reset
    echo "🥳 Schema applied to local database 🥳"
    
    echo "[3/4] Copying data from production..."
    echo "Dumping data from production (this may take a moment)..."
    
    # Create auth schema in local database if it doesn't exist
    PGPASSWORD=devpassword psql -h postgres -U devuser -d devdb -q -c "CREATE SCHEMA IF NOT EXISTS auth;" 2>/dev/null || true
    
    # Dump public schema and auth.users table
    # Use --inserts for better compatibility and to avoid COPY command issues
    (
      # Dump public schema data
      pg_dump "$PROD_DIRECT_URL" \
        --data-only \
        --no-owner \
        --no-privileges \
        --inserts \
        --rows-per-insert=100 \
        --schema=public \
        --exclude-table-data='_prisma_migrations' 2>/dev/null || echo "-- No public schema data"
      
      # Dump auth.users table (keeping it in auth schema)
      pg_dump "$PROD_DIRECT_URL" \
        --data-only \
        --no-owner \
        --no-privileges \
        --inserts \
        --rows-per-insert=100 \
        --table='auth.users' 2>/dev/null || echo "-- No auth.users data"
    ) | PGPASSWORD=devpassword psql -h postgres -U devuser -d devdb -q 2>&1 | \
      grep -v "does not exist" | grep -v "already exists" | grep -v "^$" || true
    
    echo "🥳 Data copied from production 🥳"
    
    echo "[4/4] Generating Prisma client..."
    npx prisma generate
    echo "🥳 Prisma client generated 🥳"
    
    echo "=========================================="
    echo "🥳 Sync complete! 🥳"
    echo "=========================================="
    
  else
    echo "☝️😳 Warning: No PROD_DIRECT_URL found, skipping production sync"
    # Still need to push schema and generate client
    DATABASE_URL="$LOCAL_DATABASE_URL" DIRECT_URL="$LOCAL_DIRECT_URL" npx prisma db push
    npx prisma generate
  fi
else
  echo "☝️😳 Skipping production sync (SYNC_FROM_PRODUCTION=false)"
  # Just ensure the database is migrated and seeded
  echo "Ensuring database is up to date..."
  DATABASE_URL="$LOCAL_DATABASE_URL" DIRECT_URL="$LOCAL_DIRECT_URL" npx prisma db push --accept-data-loss
  npx prisma generate
fi

# Restore local URLs for the running application
export DATABASE_URL="$LOCAL_DATABASE_URL"
export DIRECT_URL="$LOCAL_DIRECT_URL"

# Start Prisma Studio in the background
echo "Starting Prisma Studio on http://localhost:5555..."
npx prisma studio &

echo ""
echo "=========================================="
echo "Development Environment Ready"
echo "=========================================="
echo "API: http://localhost:3001"
echo "Prisma Studio: http://localhost:5555"
echo "=========================================="
echo ""

# Start the application
exec "$@"
