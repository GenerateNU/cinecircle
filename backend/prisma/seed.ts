import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding development database...');

  // Clear existing data
  await prisma.health.deleteMany({});
  console.log('  ✅ Cleared existing data');

  // Seed health records with new schema
  const healthRecords = await prisma.health.createMany({
    data: [
      {
        ex_col: {
          status: 'healthy',
          component: 'api',
          message: 'System is running normally',
          metrics: { cpu: '12%', memory: '45%' },
          timestamp: new Date().toISOString(),
        },
      },
      {
        ex_col: {
          status: 'warning',
          component: 'database',
          message: 'High memory usage detected',
          metrics: { cpu: '65%', memory: '89%' },
          timestamp: new Date().toISOString(),
        },
      },
      {
        ex_col: {
          status: 'healthy',
          component: 'cache',
          message: 'Cache performing optimally',
          metrics: { hit_rate: '95%', size: '2.1GB' },
          timestamp: new Date().toISOString(),
        },
      },
      {
        ex_col: {
          status: 'healthy',
          component: 'external_api',
          message: 'All external services responding',
          metrics: { response_time: '120ms', success_rate: '99.2%' },
          timestamp: new Date().toISOString(),
        },
      },
    ],
  });
  console.log(`  ✅ Created ${healthRecords.count} health records`);

  console.log('🎉 Development database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
