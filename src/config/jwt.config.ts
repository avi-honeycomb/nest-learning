import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'super-secret-key',
  emailSecret: process.env.APP_JWT_EMAIL_SECRET || 'email-secret-key',
  expiresIn: process.env.APP_JWT_EXPIRES_IN || '1d',
}));
