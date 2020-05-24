import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServoModule } from './servo/servo.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './guard/roles.guard';
import { PagesModule } from './pages/pages.module';
import { LoggerModule } from './logger/logger.module';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';

@Module({
  imports: [
    ServoModule,
    PagesModule,
    LoggerModule,
    ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }, {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    }],
})
export class AppModule {}

