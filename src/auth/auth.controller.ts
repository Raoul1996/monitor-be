import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService, Provider } from './auth.service';
import { UserService } from '../user/user.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LoginParams } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

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
        return this.authService.certificate(user.id,Provider.LOGIN)
      }),
      catchError(err => throwError(err))
    )
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin(){}

  @Get('callback/github')
  @UseGuards(AuthGuard('github'))
  githubLoginCallback(@Req() req){
    if (req.user){
     return this.authService.certificate(req.user.id,Provider.GITHUB)
    }
    // TODO: save && merge with local user
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedResource()
  {
    return 'JWT is working!';
  }
}
