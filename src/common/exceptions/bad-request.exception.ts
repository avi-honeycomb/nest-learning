import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class BadRequestAppException extends AppException {
  constructor(message = 'Bad request', data: Record<string, any> = {}) {
    super(message, HttpStatus.BAD_REQUEST, data);
  }
}
