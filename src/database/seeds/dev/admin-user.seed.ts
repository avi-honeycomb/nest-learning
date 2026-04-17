import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { Role } from '@/modules/roles/entities/role.entity';
import { User } from '@/modules/users/entities/user.entity';

export const seedAdminUser = async (dataSource: DataSource) => {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);

  console.log('🌱 Seeding admin user...');

  // ✅ 1. Find admin role
  const adminRole = await roleRepo.findOne({
    where: { name: 'ADMIN' },
  });

  if (!adminRole) {
    console.log('❌ Admin role not found. Seed roles first.');
    return;
  }

  // ✅ 2. Check if admin already exists
  const existingUser = await userRepo.findOne({
    where: { email: 'admin@example.com' },
  });

  if (existingUser) {
    console.log('⚠️ Admin user already exists. Skipping...');
    return;
  }

  // ✅ 3. Hash password
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  // ✅ 4. Create admin user
  const adminUser = userRepo.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: hashedPassword,
    roleId: adminRole.id,
    isActive: true,
    isVerified: true,
  });

  await userRepo.save(adminUser);

  console.log('✅ Admin user created successfully');
};
