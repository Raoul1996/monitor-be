import { CallHandler, ExecutionContext, HttpService, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';
import { Request } from 'express';
import * as qs from 'querystring';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService, private readonly httpService: HttpService) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const requestId = request.header('requestId');
    this.logger.setRequestId(requestId);
    if (requestId) {
      this.httpService.axiosRef.defaults.headers.common['x-request-id'] = requestId;
    }
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const loggerContent = this.loggerBuilder(context,Date.now() - now)
        this.logger.info(loggerContent)}),
    );
  }
  loggerBuilder(ctx:ExecutionContext,latency:number):string{
    const request: Request = ctx.switchToHttp().getRequest();
    const response: Request = ctx.switchToHttp().getResponse();
    const method = request.method
    const params = request.params
    const query = request.query
    return `${response.statusCode} ${method && method.toUpperCase()} ${request.originalUrl}${Object.values(params).join('/')}${qs.stringify(query as any)} latency: ${latency}ms`
  }
}
