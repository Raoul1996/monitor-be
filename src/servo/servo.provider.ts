import { Provider } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ServoEntity } from './servo.entity';

export const servoProviders:Provider[] = [
  {
    provide:'SERVO_REPOSITORY',
    useFactory:(connection:Connection) => connection.getRepository(ServoEntity),
    inject:['DATABASE_CONNECTION']
  }
]
