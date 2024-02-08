import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        success: true,
        message: 'Operation succeeded',
        data,
      })),
      catchError((error) => {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Unexpected error occurred';

        if (error instanceof HttpException) {
          statusCode = error.getStatus();
          message = error.getResponse()['message'] || error.message;
        }

        return throwError(() => ({
          statusCode,
          success: false,
          message,
          data: null,
        }));
      }),
    );
  }
}
