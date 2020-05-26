import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LoginParams } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService:AuthService,private readonly userService:UserService) {
  }
  @Post('login')
  login(@Body() loginParams:LoginParams):Observable<string>{
    return this.authService.validateUser(loginParams.mobile,loginParams.password).pipe(
      map(user=>{
        if (!user){
          throw new BadRequestException("Login error")
        }
        return this.authService.certificate(user)
      }),
      catchError(err => throwError(err))
    )
  }
}
