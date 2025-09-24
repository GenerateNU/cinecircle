import express from 'express';
import cors from 'cors';
import { apiReference } from '@scalar/express-api-reference';
import routes from './routes/index';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('CineCircle backend is running!');
});

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
