# CineCircle Backend

Node.js API with Express, Prisma, and PostgreSQL.

## Testing

Tests run in the development environment:

```bash
npm test               # Runs all tests using local postgres
```

**How Testing Works:**

- Uses local PostgreSQL
- Resets and seeds data before each test run
- API integration tests with real database
- Database model tests with actual schema
- Production database is never touched

## Environment Files

- **`.env`** - Development
- **`.env.production`** - Production
