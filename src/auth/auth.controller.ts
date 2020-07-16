import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException, HttpStatus,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService, Provider, ProviderId } from './auth.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LoginParams } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { UserService } from '../user/user.service';
import { User } from '../user/interfaces/user.inteface';
import { CreateUserDto } from '../user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {
  }
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto):Observable<User> {
    return this.userService.checkUserExist(createUserDto.mobile,createUserDto.email).pipe(
      //TODO: why use `mergeMap` not the `switchMap` or other High Order operator？
      mergeMap(userId => {
          if (!userId) {
            return this.userService.createUser(createUserDto);
          } else {
            throw new HttpException('user_exist', HttpStatus.CONFLICT);
          }
        },
      ),
      catchError(err => throwError(err))
    );
  }
  @Post('login')
  login(@Body() loginParams: LoginParams): Observable<string> {
    return this.authService.validateUser(loginParams.mobile, loginParams.password).pipe(
      map(user => {
        if (!user) {
          throw new BadRequestException('Login error');
        }
        const token = this.authService.certificate(`${user.id}`, user.name, Provider.LOGIN,user.role);
        return token;
      }),
      catchError(err => throwError(err)),
    );
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() {
  }

  @Get('callback/github')
  @UseGuards(GithubAuthGuard)
  githubLoginCallback(@Req() req): Observable<string> {
    if (req.user) {
      return this.userService.findOrMergeGithubUser(req.user).pipe(
        map((user: User) => {
          return this.authService.certificate(`${user.id}`, user.name, Provider.GITHUB, user.role );
        }),
        catchError(err => throwError(err)),
      );
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req) {
    switch (req.user.provider) {
      case Provider.GITHUB:
        return this.userService.queryOneUser({ where: { provider: ProviderId.GITHUB, loginId: +req.user.userId } }).pipe(
          map(user=>{
            if (!user){
              throw new NotFoundException("user not exist")
            }
            return this.userService.transEntity(user)
          }),
          catchError(err => throwError(err))
        );
      case Provider.LOGIN:
        return this.userService.queryOneUser({ where: { id: +req.user.userId } }).pipe(
          map(user=>{
            if (!user){
              throw new NotFoundException("user not exist")
            }
            return this.userService.transEntity(user)
          }),
          catchError(err => throwError(err))
        );
      default:
        return req.user
    }
  }
}
