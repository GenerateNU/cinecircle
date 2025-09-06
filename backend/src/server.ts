import app from './app.ts';
import { connectDatabase, prisma } from './services/db.ts';
import { PORT } from './config/env.ts';

const server = app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`Server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
