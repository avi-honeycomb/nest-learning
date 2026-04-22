import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.APP_DB_HOST,
  port: Number(process.env.APP_DB_PORT) || 5432,
  username: process.env.APP_DB_USERNAME,
  password: process.env.APP_DB_PASSWORD,
  name: process.env.APP_DB_NAME,
}));
