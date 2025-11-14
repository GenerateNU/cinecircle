#!/bin/sh
set -e

# Parse arguments
TARGET="local"
if [ "$1" = "--prod" ]; then
  TARGET="prod"
elif [ "$1" = "--local" ]; then
  TARGET="local"
fi

echo "=========================================="
if [ "$TARGET" = "prod" ]; then
  echo "Seed Production Supabase Database"
else
  echo "Seed Local Development Database"
fi
echo "=========================================="
echo ""

# Set the appropriate database URL
if [ "$TARGET" = "prod" ]; then
  if [ -z "$PROD_DIRECT_URL" ]; then
    echo "Error: PROD_DIRECT_URL environment variable is not set"
    echo "Please set it in your .env file"
    exit 1
  fi
  DB_URL="$PROD_DIRECT_URL"
  echo "WARNING: You are about to seed PRODUCTION database!"
  echo ""
else
  if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
  fi
  DB_URL="$DATABASE_URL"
fi

# Check if seed file exists
SEED_FILE="prisma/seed.sql"
if [ ! -f "$SEED_FILE" ]; then
  echo "Error: Seed file not found at $SEED_FILE"
  exit 1
fi

echo "This will:"
echo "  1. Truncate existing data in public schema tables"
echo "  2. Insert mock users, movies, events, posts, ratings, and comments"
echo ""
echo "Seed file: $SEED_FILE"
echo ""

# Show confirmation prompt
read -p "Continue with seeding? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Seeding cancelled."
  exit 0
fi

# Apply the seed
echo ""
echo "Applying seed data..."
echo "----------------------------------------"

# Run with better error handling
if psql "$DB_URL" -f "$SEED_FILE" 2>&1; then
  echo "----------------------------------------"
  echo ""
  echo "=========================================="
  if [ "$TARGET" = "prod" ]; then
    echo "Production database seeded!"
  else
    echo "Local database seeded!"
  fi
  echo "=========================================="
else
  echo "----------------------------------------"
  echo ""
  echo "Seeding encountered errors (see above)"
  echo "Some data may have been partially inserted"
  exit 1
fi

