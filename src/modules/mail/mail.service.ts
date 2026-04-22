import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

import { verifyEmailTemplate } from '@/common/templates/verify-email.template';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('APP_MAIL_SERVICE'),
      auth: {
        user: this.configService.get<string>('APP_MAIL_USER'),
        pass: this.configService.get<string>('APP_MAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('APP_FRONTEND_URL');

    const verifyUrl = `${frontendUrl}/auth/verify-email?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('APP_MAIL_FROM'),
        to: email,
        subject: 'Verify your email',
        html: verifyEmailTemplate(name, verifyUrl),
      });
    } catch (error) {
      console.log('Error', error);

      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }
}
