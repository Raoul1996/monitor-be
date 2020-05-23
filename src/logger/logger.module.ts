import { HttpModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerOptions } from './logger.interface';
import configuration, { LoggerConfig } from '../config/configuration';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports:[ConfigModule.forRoot({
    load:[configuration]
  }),HttpModule],
  providers:[{
    provide:LoggerService,
    useFactory:(config:ConfigService)=>{
      const loggerConfig = config.get<LoggerConfig>("logger")
      const options:LoggerOptions = {
        fileOptions:{
          filename:`${loggerConfig.logFilePath}/${config.get("serviceName")}-%DATE%.log`
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
    inject:[ConfigService]
  },{
    provide:APP_INTERCEPTOR,
    useClass:LoggingInterceptor
  }],
  exports:[LoggerService]
})
export class LoggerModule {}
