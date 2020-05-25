import { Module, NestModule } from '@nestjs/common';
import { ServoController } from './servo.controller';
import { ServoService } from './servo.service';
import { CorsMiddleware } from '@nest-middlewares/cors';
import { servoProviders } from './servo.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers:[ServoController],
  providers:[...servoProviders,ServoService],
})
export class ServoModule implements NestModule{
  configure(consumer) {
    CorsMiddleware.configure({ origin: true })
    consumer.apply(CorsMiddleware).forRoutes(ServoController)
  }
}
