import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Observable, throwError } from 'rxjs';
import { User } from '../user/interfaces/user.inteface';
import { catchError, map } from 'rxjs/operators';
import { CryptoService } from './crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';

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
  certificate(user:User){
    const payload = {sub:user.id,name:user.name,role:user.role}
    try {
      const token = this.jwtService.sign(payload)
      return token
    }catch (e) {
      this.loggerService.error(`sign error: user payload: ${JSON.stringify(payload)}`)
      return null
    }
  }
}
