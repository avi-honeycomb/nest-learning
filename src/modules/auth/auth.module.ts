import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';

import { RolesModule } from '@/modules/roles/roles.module';
import { UsersModule } from '@/modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtCookieStrategy } from './strategies/jwt-cookie.strategy';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    RolesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret') ?? 'super-secret-key',
        signOptions: {
          expiresIn:
            configService.get<StringValue>('jwt.expiresIn') ??
            ('1d' as StringValue),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtCookieStrategy],
  exports: [AuthService],
})
export class AuthModule {}
