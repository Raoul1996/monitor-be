import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Observable, throwError } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError } from 'rxjs/operators';
import configuration from '../config/configuration';

@Injectable()
export class MailSenderService {
  constructor(private readonly mailerService:MailerService) {
  }
  sendMail(options:ISendMailOptions):Observable<void>{
    return fromPromise(this.mailerService.sendMail({...options,from:configuration.mailer.defaults.from})).pipe(
      catchError(err => throwError(err))
    )
  }
}
