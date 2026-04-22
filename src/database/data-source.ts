import { DataSource } from 'typeorm';

import 'dotenv/config';

export default new DataSource({
  type: 'postgres',
  host: process.env.APP_DB_HOST,
  port: Number(process.env.APP_DB_PORT) || 5432,
  username: process.env.APP_DB_USERNAME,
  password: process.env.APP_DB_PASSWORD,
  database: process.env.APP_DB_NAME,
  entities: ['src/modules/**/*.entity.ts', 'dist/modules/**/*.entity.js'],
  migrations: [
    'src/database/migrations/*{.ts,.js}',
    'dist/database/migrations/*{.js}',
  ],
  synchronize: false,
  migrationsTableName: 'typeorm_migrations',
});
