import { Params } from 'nestjs-pino';

export const loggerConfig: Params = {
  pinoHttp: {
    level: 'debug',

    redact: ['req.headers.authorization', 'req.body.password'],

    transport: {
      targets: [
        // ✅ Pretty logs in console
        {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },

        // ✅ File logs
        {
          target: 'pino/file',
          options: {
            destination: './logs/app.log',
            mkdir: true,
          },
        },

        {
          target: 'pino/file',
          options: {
            destination: './logs/error.log',
            level: 'error',
            mkdir: true,
          },
        },
      ],
    },
  },
};
