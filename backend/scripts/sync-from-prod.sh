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

echo "[2/4] Applying schema to local database..."
npx prisma db push --force-reset
echo "🥳 Schema applied 🥳"

echo "[3/4] Copying data from production..."
if pg_dump "$PROD_DIRECT_URL" --data-only --no-owner --no-privileges 2>/dev/null | \
   PGPASSWORD=devpassword psql -h postgres -U devuser -d devdb -q 2>/dev/null; then
  echo "🥳 Data copied 🥳"
else
  echo "☝️😳 Warning: Could not copy all data"
fi

echo "[4/4] Regenerating Prisma client..."
npx prisma generate
echo "🥳 Prisma client regenerated 🥳"

echo ""
echo "=========================================="
echo "🥳 Sync complete! 🥳"
echo "=========================================="

