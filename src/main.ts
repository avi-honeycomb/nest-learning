import { join } from 'node:path';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';
import * as express from 'express';
import { PinoLogger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  // only keep this if you want Nest internal logs through pino
  // app.useLogger(app.get(Logger));

  const logger = await app.resolve(PinoLogger);
  logger.setContext('Bootstrap');

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use(cookieParser());

  app.enableCors({
    origin: configService.get<string>('APP_FRONTEND_URL'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = configService.get<number>('APP_PORT') ?? 3000;

  await app.listen(port);

  logger.info(`Server started on http://localhost:${port}`);
  console.log(`Server started on http://localhost:${port}`);
}

bootstrap();
