import { Module } from '@nestjs/common';
import { ServoController } from './servo.controller';
import { ServoService } from './servo.service';

@Module({
  controllers:[ServoController],
  providers:[ServoService]
})
export class ServoModule {private readonly servoService: ServoService}
