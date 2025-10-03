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
    # Temporarily use production URL to pull schema
    DATABASE_URL="$PROD_DIRECT_URL" DIRECT_URL="$PROD_DIRECT_URL" npx prisma db pull --force
    echo "🥳 Schema pulled from production 🥳"
    
    echo "[2/4] Applying schema to local database..."
    # Use local DATABASE_URL to push schema (this will reset the local DB)
    DATABASE_URL="$LOCAL_DATABASE_URL" DIRECT_URL="$LOCAL_DIRECT_URL" npx prisma db push --force-reset
    echo "🥳 Schema applied to local database 🥳"
    
    echo "[3/4] Copying data from production..."

    echo "Dumping data from production (this may take a moment)..."
    PGPASSWORD="${PROD_DIRECT_URL#*://}" 
    
    # Direct approach: pipe pg_dump to psql
    # pg_dump with --data-only to dump just the data
    if pg_dump "$PROD_DIRECT_URL" --data-only --no-owner --no-privileges 2>/dev/null | \
       PGPASSWORD=devpassword psql -h postgres -U devuser -d devdb -q 2>/dev/null; then
      echo "🥳 Data copied from production 🥳"
    else
      echo "☝️😳 Warning: Could not copy data from production (this might be OK if tables are empty)"
    fi
    
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
  DATABASE_URL="$LOCAL_DATABASE_URL" DIRECT_URL="$LOCAL_DIRECT_URL" npx prisma db push
  npx prisma generate
fi

echo ""
echo "=========================================="
echo "Development Environment Ready"
echo "=========================================="
echo "Local Database: postgresql://devuser:***@postgres:5432/devdb"
echo "API: http://localhost:3001"
echo "Prisma Studio: http://localhost:5555"
echo "=========================================="
echo ""

# Restore local URLs for the running application
export DATABASE_URL="$LOCAL_DATABASE_URL"
export DIRECT_URL="$LOCAL_DIRECT_URL"

# Start the application
exec "$@"
