import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServoModule } from './servo/servo.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { PagesModule } from './pages/pages.module';
import { LoggerModule } from './logger/logger.module';
import { TimeoutInterceptor } from './timeout/timeout.interceptor';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailSenderModule } from './mail-sender/mail-sender.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    UserModule,
    MailSenderModule,
    ServoModule,
    PagesModule,
    MailerModule,
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
export class AppModule{}

