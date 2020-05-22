import { Injectable } from '@nestjs/common';
import { Servo } from './interfaces/servo.interface';

@Injectable()
export class ServoService {
  private readonly servos: Servo[] = []

  create(servo:Servo){
    this.servos.push(servo)
    return servo
  }
  findAll():Servo[]{
    return this.servos
  }
  getStatus(target:number):boolean{
    return true
  }
}
