import { join } from 'path';
import { LoggerTransport } from '../logger/logger.interface';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export interface LoggerConfig {
  logLevel: string,
  logFilePath: string
  loggers: LoggerTransport[]
  colorize?: boolean
}

export interface Configuration {
  serviceName: string,
  logger: LoggerConfig
  db: SqliteConnectionOptions
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
  })
