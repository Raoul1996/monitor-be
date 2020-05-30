import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CryptoService } from '../auth/crypto/crypto.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Observable, of, throwError } from 'rxjs';
import { UserEntity } from './user.entity';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { User } from './interfaces/user.inteface';
import { Repository,FindOneOptions } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { GithubProfile } from '../auth/strategies/github.strategy';
import { Provider, ProviderId } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<UserEntity>,
    private readonly cryptoService: CryptoService,
    private readonly loggerService: LoggerService) {
  }

  public transEntity(user: UserEntity): User {
    if (!user) return;
    return {
      id: user.id,
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
    };
  }

  private transPayload(userEntity: UserEntity, payload: CreateUserDto | UpdateUserDto, isUpdate: boolean): UserEntity {
    userEntity.mobile = payload.mobile;
    userEntity.name = payload.name;
    userEntity.gender = payload.gender;
    userEntity.email = payload.email;
    userEntity.avatarUri = payload.avatarUri;
    userEntity.zone = payload.zone;
    userEntity.provider = ProviderId[Provider.LOGIN]
    userEntity.updateTime = new Date().valueOf();
    if (!isUpdate) {
      userEntity.createTime = new Date().valueOf();
    }
    return userEntity;
  }

  public createUser(payload: CreateUserDto): Observable<User> {
    const userEntity = this.transPayload(new UserEntity(), payload, false);
    userEntity.password = this.cryptoService.hashPassword(payload.password);

    return fromPromise(this.userRepository.save(userEntity)).pipe(
      map((user: UserEntity) => this.transEntity(user)),
      catchError(err => throwError(err)),
    );
  }

  public findOrMergeGithubUser(payload: GithubProfile): Observable<User> {
    const loginId = payload._json.id;
    return fromPromise(this.userRepository.findOne({
      where: { loginId },
    })).pipe(
      mergeMap((user) => {
        if (!user) {
          return this.createUserViaGithub(payload)
        }
        return of(this.transEntity(user));
      }),
      catchError(err => throwError(err))
    );

  }

  public createUserViaGithub(payload: GithubProfile): Observable<User> {
    const userEntity = new UserEntity()
    userEntity.name =  payload._json.login
    userEntity.email = payload.emails[0].value
    userEntity.provider = ProviderId[Provider[payload.provider]]
    userEntity.avatarUri = payload._json.avatar_url
    userEntity.loginId = payload._json.id
    userEntity.createTime = new Date().valueOf()
    userEntity.updateTime = new Date().valueOf()
    return fromPromise(this.userRepository.save(userEntity)).pipe(
      map(this.transEntity),
      catchError(err=>throwError(err))
    )
  }

  public checkUserExist(mobile: number, email: string): Observable<boolean> {
    return this.queryUserByEmailOrMobile({ mobile, email }).pipe(
      map((v) => !!v?.id),
      catchError(err => throwError(err)),
    );
  }

  public queryUserByEmailOrMobile({ mobile, email }: { mobile?: number, email?: string }): Observable<User> {
    const findOptions = [];
    if (!mobile && !email) {
      return throwError(new BadRequestException('no email and mobile provide'));
    }
    if (mobile) {
      findOptions.push({ mobile });
    }
    if (email) {
      findOptions.push({ email });
    }
    return fromPromise(this.userRepository.findOne({
      where: findOptions,
    })).pipe(
      map((user) => this.transEntity(user)),
      catchError(err => throwError(err)),
    );
  }

  public queryOneUser(options:FindOneOptions<UserEntity>): Observable<UserEntity> {
    return fromPromise(this.userRepository.findOne(options)).pipe(
      catchError(err => throwError(err)),
    );

  }

  public updateUser(id: number, payload: UpdateUserDto): Observable<User> {
    return fromPromise(this.userRepository.findOne({ id: id })).pipe(
      map((user) => {
        if (!user) {
          throwError(new NotFoundException('not Found'));
          this.loggerService.error(`[update user] not found, id: ${id}`);
        }
        const updatedUserEntity = this.transPayload(user, payload, true);
        if (payload.password) {
          updatedUserEntity.password = this.cryptoService.hashPassword(payload.password);
        }
        return updatedUserEntity;
      }),
      catchError(err => throwError(err)),
    );
  }
}
