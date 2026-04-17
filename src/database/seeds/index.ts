import dataSource from '@/database/data-source';
import { seedAdminUser } from '@/database/seeds/dev/admin-user.seed';
import { seedRoles } from '@/database/seeds/master/role.seed';

async function runSeeds() {
  await dataSource.initialize();

  console.log('🚀 Seeding started...');

  await seedRoles(dataSource);
  await seedAdminUser(dataSource);

  console.log('✅ Seeding finished...');

  await dataSource.destroy();
}

runSeeds();
