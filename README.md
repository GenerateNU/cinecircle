# CineCircle

A full-stack React Native app with Express backend and PostgreSQL database, all running in Docker.

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js (for frontend development)

### Running the Application

1. **Start the backend and database:**
   ```bash
   docker-compose up
   ```

2. **Start the frontend (in a separate terminal):**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Test the setup:**
   - Open the Expo app on your phone or simulator
   - Click "Ping Backend" to test the backend connection
   - Click "Test Database" to test the PostgreSQL connection

## Architecture

- **Frontend**: React Native with Expo
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL 15
- **Containerization**: Docker Compose

## API Endpoints

- `GET /` - Backend health check
- `GET /api/ping` - Simple ping endpoint
- `GET /api/db-test` - Test database connection

## Development

### Backend Development
The backend runs in development mode with hot reloading when using Docker Compose. Changes to the source code will automatically restart the server.

### Database
- **Host**: localhost:5432
- **Database**: cinecircle
- **Username**: postgres
- **Password**: password

### Environment Variables
The backend uses the following environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

## Production Deployment

To build for production:

1. Update the Dockerfile to build the TypeScript code
2. Use `npm start` instead of `npm run dev`
3. Set appropriate environment variables

## Troubleshooting

- If the backend can't connect to the database, make sure PostgreSQL is fully started (check the health check in docker-compose.yml)
- If the frontend can't reach the backend, ensure the backend is running on port 3001
- Check Docker logs: `docker-compose logs backend` or `docker-compose logs postgres`