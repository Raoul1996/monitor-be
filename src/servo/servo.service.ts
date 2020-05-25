import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Servo } from './interfaces/servo.interface';
import { QueryFailedError, Repository } from 'typeorm';
import { ServoEntity } from './servo.entity';
import { Observable, throwError } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, filter, map } from 'rxjs/operators';
import { error } from 'winston';
import { CreateServoDto } from './dto/servo.dto';

@Injectable()
export class ServoService {
  constructor(
    @Inject('SERVO_REPOSITORY') private servoRepository: Repository<ServoEntity>,
  ) {
  }

  create(servo: CreateServoDto): Observable<ServoEntity> {
    fromPromise(this.servoRepository.findOne({
      where:{name:servo.name}
    })).pipe(
      map(v=>{
        if (v){
          throw new HttpException({code:HttpStatus.UNPROCESSABLE_ENTITY,error:'exists.'},HttpStatus.UNPROCESSABLE_ENTITY)
        }
      })
    )
    const servoEntity = new ServoEntity();
    servoEntity.createTime = new Date().valueOf();
    servoEntity.name = servo.name;
    servoEntity.type = servo.type;
    servoEntity.description = servo.description;
    servoEntity.ownerId=1
    return fromPromise(this.servoRepository.save(servoEntity)).pipe(
      catchError(err =>{
        return throwError(err)}),
    );
  }

  findAll({ take, skip }): Observable<{ servos: ServoEntity[], count: number }> {
    return fromPromise(this.servoRepository.findAndCount({
      where: { isDel: 0, isLocked: 0, isPublic: 1 },
      order: { createTime: 'DESC' },
      take: take,
      skip: skip,
    })).pipe(
      map(([servos, count]) => ({
        servos: servos.map(v => ({
          id: v.id,
          name: v.name,
          description: v.description,
          type: v.type,
          ownerId: v.ownerId,
          createTime: v.createTime,
        })), count,
      })),
      catchError((err: QueryFailedError) => {
        return throwError(err);
      }),
    );
  }


  getStatus(target: number): boolean {
    return true;
  }
}
