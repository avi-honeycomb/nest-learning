import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: Number(process.env.APP_PORT) || 3000,
  baseUrl: process.env.APP_BASE_URL,
  frontendUrl: process.env.APP_FRONTEND_URL,
  env: process.env.NODE_ENV || 'development',
}));
