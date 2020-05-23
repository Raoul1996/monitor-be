import { join } from 'path';
import { LoggerTransport } from '../logger/logger.interface';

export interface LoggerConfig {
  logLevel: string,
  logFilePath: string[]
  loggers:LoggerTransport[]
  colorize?:boolean
}
export interface Configuration {
  serviceName:string;
  logger:LoggerTransport
}
export default ()=>(
  {
  serviceName: 'project.side.monitor_be',
  logger: {
    logLevel: 'debug',
    logFilePath: join(__dirname, '../../', 'log'),
    loggers:[LoggerTransport.ROTATE,LoggerTransport.CONSOLE],
    colorize:true
  },
})
