import { Inject, Injectable } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { ServoEntity } from './servo.entity';
import { Observable, throwError } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map } from 'rxjs/operators';
import { CreateServoDto } from './dto/servo.dto';
import { Servo } from './interface/servo.interface';

@Injectable()
export class ServoService {
  constructor(
    @Inject('SERVO_REPOSITORY') private servoRepository: Repository<ServoEntity>,
  ) {
  }

  create(servo: CreateServoDto): Observable<Servo> {
    const servoEntity = new ServoEntity();
    servoEntity.createTime = new Date().valueOf();
    servoEntity.name = servo.name;
    servoEntity.type = servo.type;
    servoEntity.description = servo.description;
    servoEntity.ownerId=1
    return fromPromise(this.servoRepository.save(servoEntity)).pipe(
      map((servo)=>({
        id: servo.id,
        name: servo.name,
        description: servo.description,
        type: servo.type,
        ownerId: servo.ownerId,
        createTime: servo.createTime,
        updateTime:servo.updateTime,
      })),
      catchError(err =>{
        return throwError(err)}),
    );
  }

  findAll({ take, skip }): Observable<{ servos: Servo[], count: number }> {
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
          updateTime:v.updateTime,
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
