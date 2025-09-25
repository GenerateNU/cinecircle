import express from 'express';
import cors from 'cors';
import { apiReference } from '@scalar/express-api-reference';
import routes from './routes/index';
import { requestLogger, errorLogger } from './utils/logger';

const app = express();

// Add logging middleware
app.use(requestLogger);

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('CineCircle backend is running!');
});

// Add error logging
app.use(errorLogger);

// Register all routes
app.use(routes);

// Scalar API Docs
app.use(
  '/docs',
  apiReference({
    url: '/swagger-output.json',
    theme: 'laserwave',
  })
);

export default app;
