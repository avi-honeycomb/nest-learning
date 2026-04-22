import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  service: process.env.APP_MAIL_SERVICE,
  user: process.env.APP_MAIL_USER,
  pass: process.env.APP_MAIL_PASS,
  from: process.env.APP_MAIL_FROM,
}));
