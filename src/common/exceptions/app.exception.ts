import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    message: string | string[],
    statusCode: HttpStatus,
    data: Record<string, any> = {},
  ) {
    super(
      {
        status: false,
        message,
        data,
      },
      statusCode,
    );
  }
}
