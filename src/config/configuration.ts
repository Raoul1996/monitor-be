import { join } from 'path';
import { LoggerTransport } from '../logger/logger.interface';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export interface LoggerConfig {
  logLevel: string,
  logFilePath: string
  loggers: LoggerTransport[]
  colorize?: boolean
}

export interface OAuthConfig {
  github:{
    clientId: string,
    clientSecret:string,
    callbackURL:string
  }
}
export interface JwtConfig {
  secret:string,
  expiredIn:number
}
export interface Configuration {
  serviceName: string,
  logger: LoggerConfig
  db: SqliteConnectionOptions,
  oAuth: OAuthConfig
  jwt:JwtConfig
}

export default {
    serviceName: 'project.side.monitor_be',
    logger: {
      logLevel: 'debug',
      logFilePath: join(__dirname, '../../', 'log'),
      loggers: [LoggerTransport.ROTATE, LoggerTransport.CONSOLE],
      colorize: true,
    },
    db: {
      type: 'sqlite',
      database:join(__dirname,"../../",'monitor.db')
    },
    oAuth:{
      github:{
        clientId: "0a0435e936279e806911",
        clientSecret:"152d69f6127fa838346d2f4e0ce074d37b2a8ac4",
        callbackURL:"http://localhost:3000/auth/callback/github/"
      }
    },
    jwt:{
      secret:"monitor_be",
      // unit:ms
      expiresIn:8*3600*1000,
    }
}
