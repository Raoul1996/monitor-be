import { Module, NestModule } from '@nestjs/common';
import { ServoController } from './servo.controller';
import { ServoService } from './servo.service';
import { CorsMiddleware } from '@nest-middlewares/cors';
import { servoProviders } from './servo.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServoEntity } from './servo.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers:[ServoController],
  providers:[...servoProviders,ServoService],
})
export class ServoModule implements NestModule{
  private readonly servoService: ServoService
  configure(consumer) {
    CorsMiddleware.configure({ origin: true })
    consumer.apply(CorsMiddleware).forRoutes(ServoController)
  }
}
