import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailSenderService } from './mail-sender.service';
import configuration from '../config/configuration';

@Module({
  imports:[MailerModule.forRoot(configuration.mailer)],
  providers: [MailSenderService],
  exports:[MailSenderService]
})
export class MailSenderModule {}
