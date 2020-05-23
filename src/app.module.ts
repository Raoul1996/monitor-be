import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServoModule } from './servo/servo.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { ServoController } from './servo/servo.controller';
import { CorsMiddleware } from '@nest-middlewares/cors';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { PagesModule } from './pages/pages.module';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ServoModule, PagesModule, ConfigModule.forRoot(),LoggerModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
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
