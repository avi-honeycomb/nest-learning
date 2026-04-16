import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class NotFoundAppException extends AppException {
  constructor(message = 'Resource not found', data: Record<string, any> = {}) {
    super(message, HttpStatus.NOT_FOUND, data);
  }
}
