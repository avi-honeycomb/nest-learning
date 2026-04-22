import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, IsUrl, validateSync } from 'class-validator';

class EnvValidationSchema {
  @IsNumber()
  APP_PORT: number;

  @IsUrl(
    {
      require_tld: false,
      require_protocol: true,
    },
    { message: 'APP_BASE_URL must be a valid URL' },
  )
  APP_BASE_URL: string;

  @IsUrl(
    {
      require_tld: false,
      require_protocol: true,
    },
    { message: 'APP_FRONTEND_URL must be a valid URL' },
  )
  APP_FRONTEND_URL: string;

  @IsString()
  APP_DB_HOST: string;

  @IsNumber()
  APP_DB_PORT: number;

  @IsString()
  APP_DB_USERNAME: string;

  @IsString()
  APP_DB_PASSWORD: string;

  @IsString()
  APP_DB_NAME: string;

  @IsString()
  APP_JWT_SECRET: string;

  @IsString()
  APP_JWT_EMAIL_SECRET: string;

  @IsString()
  APP_JWT_EXPIRES_IN: string;

  @IsString()
  APP_MAIL_SERVICE: string;

  @IsString()
  APP_MAIL_USER: string;

  @IsString()
  APP_MAIL_PASS: string;

  @IsString()
  APP_MAIL_FROM: string;
}

const allowedEnvKeys = [
  'APP_PORT',
  'APP_BASE_URL',
  'APP_FRONTEND_URL',
  'APP_DB_HOST',
  'APP_DB_PORT',
  'APP_DB_USERNAME',
  'APP_DB_PASSWORD',
  'APP_DB_NAME',
  'APP_JWT_SECRET',
  'APP_JWT_EMAIL_SECRET',
  'APP_JWT_EXPIRES_IN',
  'APP_MAIL_SERVICE',
  'APP_MAIL_USER',
  'APP_MAIL_PASS',
  'APP_MAIL_FROM',
];

export function validateEnv(config: Record<string, unknown>) {
  const appConfig = Object.fromEntries(
    Object.entries(config).filter(([key]) => key.startsWith('APP_')),
  );

  const validatedConfig = plainToInstance(EnvValidationSchema, appConfig, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const formattedErrors = errors
      .map((error) => Object.values(error.constraints || {}).join(', '))
      .join('; ');

    throw new Error(`ENV Validation Error: ${formattedErrors}`);
  }

  const extraKeys = Object.keys(appConfig).filter(
    (key) => !allowedEnvKeys.includes(key),
  );

  if (extraKeys.length > 0) {
    throw new Error(
      `ENV Validation Error: Unknown environment variables found: ${extraKeys.join(', ')}`,
    );
  }

  return validatedConfig;
}
