import { join } from 'path';
import { LoggerTransport } from '../logger/logger.interface';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export interface LoggerConfig {
  logLevel: string,
  logFilePath: string
  loggers: LoggerTransport[]
  colorize?: boolean
}

export interface oAuthConfig {
  clientId: string,
  clientSecret:string
}
export interface Configuration {
  serviceName: string,
  logger: LoggerConfig
  db: SqliteConnectionOptions,
  oAuth: oAuthConfig
}

export default (): Configuration => (
  {
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
      clientId: "0a0435e936279e806911",
      clientSecret:"152d69f6127fa838346d2f4e0ce074d37b2a8ac4"
    }
  })
