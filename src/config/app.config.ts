import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: Number(process.env.PORT) || 3000,
  frontendUrl: process.env.FRONTEND_URL,
  env: process.env.NODE_ENV || 'development',
}));
