import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
async function seed() {
  if (process.env.NODE_ENV !== 'development') throw new Error('Demo seed requires NODE_ENV=development');
  await db.$transaction(async tx => {
    const branch = await tx.branch.upsert({
      where: { slug: 'demo-central' }, update: {},
      create: { slug: 'demo-central', name: 'Demo Central Branch', timezone: 'UTC', address: 'Demo address — replace before launch' },
    });
    const category = await tx.category.upsert({
      where: { slug: 'demo-sedan' }, update: {}, create: { slug: 'demo-sedan', name: 'Demo Sedan' },
    });
    await tx.vehicle.upsert({
      where: { slug: 'demo-toyota-corolla' }, update: {}, create: {
        slug: 'demo-toyota-corolla', vin: 'DEMO0000000000001', registrationNumber: 'DEMO-001',
        make: 'Toyota', model: 'Corolla (demo)', modelYear: 2025, seats: 5,
        transmission: 'AUTOMATIC', fuelType: 'PETROL', baseDailyMinor: 5000n, currency: 'USD',
        branchId: branch.id, categoryId: category.id,
      },
    });
  });
  console.log('Demo catalog seeded; existing records preserved. Prices are illustrative.');
}
seed().catch(() => { console.error('Demo seed failed. Check configuration and migrations.'); process.exitCode = 1; })
  .finally(() => db.$disconnect());
