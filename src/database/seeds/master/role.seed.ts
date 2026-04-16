import { Role } from 'src/modules/roles/entities/role.entity';
import { DataSource } from 'typeorm';

export const seedRoles = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Role);
  const tableName = repo.metadata.tableName;

  console.log('🌱 Seeding roles...');

  // 🔥 Reset table + ID
  await dataSource.query(
    `TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`,
  );

  const roles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'USER' },
  ];

  await repo.save(roles);

  console.log('✅ Roles seeded');
};
