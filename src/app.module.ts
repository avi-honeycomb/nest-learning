import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from 'nestjs-pino';

import {
  appConfig,
  databaseConfig,
  jwtConfig,
  loggerConfig,
  mailConfig,
  validateEnv,
} from '@/config';

import { AuthModule } from '@/modules/auth/auth.module';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { MailModule } from '@/modules/mail/mail.module';
import { RolesModule } from '@/modules/roles/roles.module';
import { TasksModule } from '@/modules/tasks/tasks.module';
import { UsersModule } from '@/modules/users/users.module';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { RolesGuard } from '@/common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, mailConfig],
      validate: validateEnv,
    }),

    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (dbConfig: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.name,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    LoggerModule.forRoot(loggerConfig),

    ScheduleModule.forRoot(),

    RolesModule,
    UsersModule,
    AuthModule,
    MailModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
