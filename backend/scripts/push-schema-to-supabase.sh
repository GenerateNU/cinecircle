#!/bin/sh
set -e

echo "=========================================="
echo "Push Schema Changes to Supabase"
echo "=========================================="
echo ""

# Check if PROD_DIRECT_URL is set
if [ -z "$PROD_DIRECT_URL" ]; then
  echo "Error: PROD_DIRECT_URL environment variable is not set"
  echo "Please set it in your .env file"
  exit 1
fi

echo "Using Supabase: ${PROD_DIRECT_URL%%@*}@***"
echo ""

# Generate the migration SQL diff
echo "[1/3] Generating SQL diff from schema.prisma..."

# Create migrations directory if it doesn't exist
mkdir -p prisma/migrations

MIGRATION_FILE="prisma/migrations/migration-$(date +%Y%m%d-%H%M%S).sql"

npx prisma migrate diff \
  --from-url "$PROD_DIRECT_URL" \
  --to-schema-datamodel prisma/schema.prisma \
  --script > "$MIGRATION_FILE" 2>&1

if [ $? -ne 0 ]; then
  echo "Failed to generate migration diff"
  exit 1
fi

echo "Migration file generated: $MIGRATION_FILE"

# Check if there are any changes
if [ ! -s "$MIGRATION_FILE" ]; then
  echo "No schema changes detected - database is already up to date"
  rm -f "$MIGRATION_FILE"
  exit 0
fi

echo "Raw migration generated ($(wc -l < "$MIGRATION_FILE") lines)"

# Note about auth schema changes
echo "[2/3] Checking for public schema changes..."
if grep -q '"public"\.' "$MIGRATION_FILE"; then
  echo "Found public schema changes"
  
  # Count auth vs public changes
  AUTH_LINES=$(grep -c '"auth"\.' "$MIGRATION_FILE" || echo "0")
  PUBLIC_LINES=$(grep -c '"public"\.' "$MIGRATION_FILE" || echo "0")
  
  if [ "$AUTH_LINES" -gt 0 ]; then
    echo "Warning: Migration includes $AUTH_LINES auth schema changes"
    echo "Supabase manages the auth schema - these may fail or be unnecessary"
  fi
  
  echo "Found $PUBLIC_LINES public schema changes to apply"
else
  echo "No public schema changes detected (only auth schema)"
  echo "Supabase manages the auth schema - no action needed"
  rm -f "$MIGRATION_FILE"
  exit 0
fi

echo ""
echo "Generated SQL migration:"
echo "----------------------------------------"
cat "$MIGRATION_FILE"
echo "----------------------------------------"
echo ""
echo "Migration saved to: $MIGRATION_FILE"
echo ""

# Ask user if they want to apply
read -p "Apply this migration to Supabase? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Migration NOT applied. SQL saved to $MIGRATION_FILE for manual review."
  exit 0
fi

# Apply the migration
echo "[3/3] Applying migration to Supabase..."
psql "$PROD_DIRECT_URL" -f "$MIGRATION_FILE" 2>&1

if [ $? -ne 0 ]; then
  echo ""
  echo "Migration failed!"
  echo "Migration file saved at: $MIGRATION_FILE"
  exit 1
fi

echo ""
echo "Migration applied successfully!"
echo ""
read -p "Delete migration file? (Y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
  rm -f "$MIGRATION_FILE"
  echo "Migration file deleted"
else
  echo "Migration file kept at: $MIGRATION_FILE"
fi

echo ""
echo "=========================================="
echo "Schema push complete!"
echo "=========================================="

