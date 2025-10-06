#!/bin/sh
set -e

echo "=========================================="
echo "Manual Production Sync"
echo "=========================================="
echo ""
echo "This will:"
echo "  1. Pull schema from production"
echo "  2. Reset local database"
echo "  3. Copy all data from production"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Sync cancelled."
    exit 0
fi

echo ""
echo "[1/4] Pulling schema from production..."
DATABASE_URL="$PROD_DIRECT_URL" DIRECT_URL="$PROD_DIRECT_URL" npx prisma db pull --force
echo "🥳 Schema pulled 🥳"

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
echo "🥳 Schema sanitized 🥳"

echo "[2/4] Applying schema to local database..."
npx prisma db push --force-reset
echo "🥳 Schema applied 🥳"

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

echo "[4/4] Regenerating Prisma client..."
npx prisma generate
echo "🥳 Prisma client regenerated 🥳"

echo ""
echo "=========================================="
echo "🥳 Sync complete! 🥳"
echo "=========================================="

