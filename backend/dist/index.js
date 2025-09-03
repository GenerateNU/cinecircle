import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/cinecircle',
});
// Test database connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});
pool.on('error', (err) => {
    console.error('PostgreSQL connection error:', err);
});
app.get('/', (_req, res) => {
    res.send('CineCircle backend is running!');
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
app.get('/api/ping', (_req, res) => {
    res.json({ message: 'pong from backend!' });
});
// Database test endpoint
app.get('/api/db-test', async (_req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version');
        res.json({
            message: 'Database connection successful!',
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default app;
//# sourceMappingURL=index.js.map