import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly logger:LoggerService) {}

  @Get()
  getHello(): string {
    this.logger.info(`get Hello`)
    return this.appService.getHello();
  }
}
