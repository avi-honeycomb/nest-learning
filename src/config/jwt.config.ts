import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'super-secret-key',
  emailSecret: process.env.JWT_EMAIL_SECRET || 'email-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
}));
