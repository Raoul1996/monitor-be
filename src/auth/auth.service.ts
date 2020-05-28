import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Observable, throwError } from 'rxjs';
import { User } from '../user/interfaces/user.inteface';
import { catchError, map } from 'rxjs/operators';
import { CryptoService } from './crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';
import configuration from '../config/configuration';
export enum Provider {
  GITHUB="github",
  GOOGLE="google",
  LOGIN="LOGIN"
}

@Injectable()
export class AuthService {
  constructor(private readonly userService:UserService,
              private readonly cryptoService:CryptoService,
              private readonly jwtService:JwtService,
              private readonly loggerService:LoggerService
  ) {
  }
  validateUser(mobile:number,password:string):Observable<User>{
    return this.userService.queryOneUser({mobile}).pipe(
      map(user=>{
        if (user && this.cryptoService.validatePassword(user.password,password)){
          return user
        }
      }),
      catchError(err => throwError(err))
    )
  }
  certificate(userId:number|string,provider: Provider){
    const payload = {sub:userId,provider}
    try {
      const token = this.jwtService.sign(payload,{expiresIn:configuration.jwt.expiresIn})
      return token
    }catch (e) {
      this.loggerService.error(`sign error: user payload: ${JSON.stringify(payload)}`)
      return null
    }
  }
}
