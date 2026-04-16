import dataSource from '../data-source';
import { seedRoles } from './master/role.seed';

async function runSeeds() {
  await dataSource.initialize();

  console.log('🚀 Seeding started...');

  await seedRoles(dataSource);

  console.log('✅ Seeding finished...');

  await dataSource.destroy();
}

runSeeds();
