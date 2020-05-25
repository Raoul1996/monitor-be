import { Inject, Injectable } from '@nestjs/common';
import { CryptoService } from '../auth/crypto/crypto.service';
import { CreateUserDto } from './dto/user.dto';
import { Observable, throwError } from 'rxjs';
import { UserEntity } from './user.entity';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map } from 'rxjs/operators';
import { User } from './interfaces/user.inteface';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<UserEntity>,
    private readonly cryptoService: CryptoService) {
  }

  public create(createUserDto: CreateUserDto): Observable<User> {


    const salt = this.cryptoService.genSalt();
    const userEntity = new UserEntity();
    userEntity.mobile = createUserDto.mobile;
    userEntity.name = createUserDto.name;
    userEntity.password = this.cryptoService.hashPassword(createUserDto.password, salt);
    userEntity.salt = salt;
    userEntity.gender = createUserDto.gender;
    userEntity.email = createUserDto.email;
    userEntity.avatarUri = createUserDto.avatarUri;
    userEntity.zone = createUserDto.zone;
    userEntity.createTime = new Date().valueOf()
    userEntity.updateTime = new Date().valueOf()

    return fromPromise(this.userRepository.save(userEntity)).pipe(
      map((user: UserEntity) => ({
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        avatarUri: user.avatarUri,
        gender: user.gender,
        zone: user.zone,
        status: user.status,
        createTime: user.createTime,
        updateTime: user.updateTime,
        role: user.role,
      })),
      catchError(err => throwError(err)),
    );
  }

  public checkUserExist(createUserDto:CreateUserDto):Observable<number>{
    return fromPromise(this.userRepository.findOne({
      where:[{
        mobile:createUserDto.mobile,
      },{ email:createUserDto.email}]
    })).pipe(
      map((v)=>v?.id),
      catchError(err => throwError(err))
    )
  }
}
