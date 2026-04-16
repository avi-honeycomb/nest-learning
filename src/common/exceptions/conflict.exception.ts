import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class ConflictAppException extends AppException {
  constructor(message = 'Conflict', data: Record<string, any> = {}) {
    super(message, HttpStatus.CONFLICT, data);
  }
}
