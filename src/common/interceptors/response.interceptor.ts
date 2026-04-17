import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: any) => {
        console.log('response', response);
        const message = response?.message ?? '';
        let data = response?.data ?? {};

        console.log('data', data);

        // if (Array.isArray(data)) {
        //   data = { list: data };
        // }

        if (data === null || typeof data !== 'object') {
          data = {};
        }

        return {
          status: true,
          message,
          data,
        };
      }),
    );
  }
}
