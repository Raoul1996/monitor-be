import { HttpModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerOptions } from './logger.interface';
import configuration from '../config/configuration';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports:[HttpModule],
  providers:[{
    provide:LoggerService,
    useFactory:()=>{
      const loggerConfig = configuration.logger
      const options:LoggerOptions = {
        fileOptions:{
          filename:`${loggerConfig.logFilePath}/${configuration.serviceName}-%DATE%.log`
        },
        colorize:loggerConfig.colorize
      }
      const loggers = LoggerService.getLoggers(
        loggerConfig.loggers,
        options
      )
      return new LoggerService(
        loggerConfig.logLevel,
        loggers
      )
    },
  },{
    provide:APP_INTERCEPTOR,
    useClass:LoggingInterceptor
  }],
  exports:[LoggerService]
})
export class LoggerModule {}
