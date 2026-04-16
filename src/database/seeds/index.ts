import dataSource from '@/database/data-source';
import { seedRoles } from '@/database/seeds/master/role.seed';

async function runSeeds() {
  await dataSource.initialize();

  console.log('🚀 Seeding started...');

  await seedRoles(dataSource);

  console.log('✅ Seeding finished...');

  await dataSource.destroy();
}

runSeeds();
