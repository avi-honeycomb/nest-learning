import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TasksService {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(TasksService.name);
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    timeZone: 'UTC', // recommended
  })
  handleEveryMinute() {
    // this.logger.info('Hello Cron');
  }

  @Cron(CronExpression.EVERY_10_SECONDS, {
    timeZone: 'UTC', // recommended
  })
  handleEvery10Seconds() {
    // this.logger.info('Hello Cron 10 Sec');
  }
}
