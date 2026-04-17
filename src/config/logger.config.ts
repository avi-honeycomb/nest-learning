import { Params } from 'nestjs-pino';
import pino from 'pino';

export const loggerConfig: Params = {
  pinoHttp: {
    level: 'debug',

    // JSON log timestamp in UTC
    timestamp: pino.stdTimeFunctions.isoTime,

    redact: {
      paths: ['req.headers.authorization', 'req.body.password'],
      remove: true,
    },

    transport: {
      targets: [
        // Console logs
        {
          target: 'pino-pretty',
          level: 'debug',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
          },
        },

        // All logs -> daily file
        {
          target: 'pino-roll',
          level: 'debug',
          options: {
            file: './logs/app.log',
            frequency: 'daily',
            dateFormat: 'yyyy-MM-dd',
            maxFiles: 7,
            mkdir: true,
          },
        },

        // Error logs -> separate daily file
        {
          target: 'pino-roll',
          level: 'error',
          options: {
            file: './logs/error.log',
            frequency: 'daily',
            dateFormat: 'yyyy-MM-dd',
            maxFiles: 30,
            mkdir: true,
            // size: '50m', // optional
          },
        },
      ],
    },
  },
};
