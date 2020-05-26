import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { User } from './interfaces/user.inteface';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { catchError, mergeMap } from 'rxjs/operators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post()
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
}
