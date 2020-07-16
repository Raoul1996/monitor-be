import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Observable, throwError } from 'rxjs';
import { User } from '../user/interfaces/user.inteface';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { CryptoService } from './crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';
import configuration from '../config/configuration';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { AuthEntity } from './auth.entity';
import { fromPromise } from 'rxjs/internal-compatibility';

export enum Provider {
  GITHUB = 'github',
  GOOGLE = 'google',
  LOGIN = 'LOGIN'
}

export const ProviderId = {
  GITHUB: 1,
  GOOGLE: 2,
};

export interface JwtContent {
  sub: string;
  username: string;
  role?: string;
  provider: Provider
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_REPOSITORY') private authRepository: Repository<AuthEntity>,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
    private readonly mailSenderService: MailSenderService,
  ) {
  }

  public validateUser(mobile: number, password: string): Observable<User> {
    return this.userService.queryOneUser({ where: { mobile } }).pipe(
      tap(user => console.log(user)),
      map(user => {
        if (user && this.cryptoService.validatePassword(user.password, password)) {
          return user;
        }
      }),
      catchError(err => throwError(err)),
    );
  }

  public certificate(userId: string, username: string, provider: Provider, role?: number): string {
    const payload = { sub: userId, username: username, provider, role };
    try {
      const token = this.jwtService.sign(payload, { expiresIn: configuration.jwt.expiresIn });
      return token;
    } catch (e) {
      this.loggerService.error(`sign error: user payload: ${JSON.stringify(payload)}`);
      return null;
    }
  }

  public sendVerifyMail(userId: number, email: string): Observable<void> {
    return fromPromise(this.authRepository.save({
      code: this.cryptoService.genSalt(),
      user_id: userId,
      createTime: new Date().valueOf(),
      updateTime: new Date().valueOf(),
    })).pipe(
      mergeMap(item => {
        const options: ISendMailOptions = {
          to: email,
          subject: 'User Register Verify',
          template: 'userVerify',
          context: {
            code: item.code,
          },
        };
        return this.mailSenderService.sendMail(options);
      }),
      catchError(err => throwError(err))
    );
  }
  activeVerifyMail(userId:number,code:string):Observable<void>{
    return fromPromise(this.authRepository.findOne({
      where: {
        user_id:userId,
        code,
        status:0
      }
    })).pipe(
      map( item=>{
        if (item.code){
           fromPromise(this.authRepository.update(item,{status:1}))
        }
      }),
      catchError(err => throwError(err))
    )
  }
}
