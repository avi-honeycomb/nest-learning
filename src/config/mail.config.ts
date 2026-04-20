import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  service: process.env.MAIL_SERVICE,
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
  from: process.env.MAIL_FROM,
}));
