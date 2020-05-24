import { Inject, Injectable } from '@nestjs/common';
import { Servo } from './interfaces/servo.interface';
import { Repository } from 'typeorm';
import { ServoEntity } from './servo.entity';
import { Observable, throwError } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ServoService {
  constructor(
    @Inject('SERVO_REPOSITORY') private servoRepository: Repository<ServoEntity>,
  ) {
  }

  create(servo: Servo): Observable<ServoEntity> {
    const servoEntity = new ServoEntity();
    servoEntity.createTime = new Date().valueOf();
    servoEntity.name = servo.name;
    servoEntity.type = servo.type;
    servoEntity.description = servo.description;
    servoEntity.ownerId=1
    return fromPromise(this.servoRepository.save(servoEntity)).pipe(
      catchError(err => throwError(err)),
    );
  }

  findAll({ take, skip }): Observable<{ servos: ServoEntity[], count: number }> {
    return fromPromise(this.servoRepository.findAndCount({
      where: { isDel: 0, isLocked: 0, isPublic: 1 },
      order: { createTime: 'DESC' },
      take: take,
      skip: skip,
    })).pipe(
      map(([servos, count]) => ({ servos, count })),
      catchError(err => throwError(err)),
    );
  }

  getStatus(target: number): boolean {
    return true;
  }
}
