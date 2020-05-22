import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServoModule } from './servo/servo.module';
import { LoggerMiddleware } from './logger.middleware';
import { ServoController } from './servo/servo.controller';
import { CorsMiddleware } from '@nest-middlewares/cors';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [ServoModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }, {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    CorsMiddleware.configure({ origin: true });
    consumer.apply(LoggerMiddleware, CorsMiddleware)
      .exclude({
        path: 'servo/status',
        method: RequestMethod.GET,
      }, 'servo/(.*)')
      .forRoutes(ServoController);
  }
}
