import * as Transport from 'winston-transport';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import DailyRotateFile = require('winston-daily-rotate-file');

export enum LoggerTransport {
  CONSOLE = 'console',
  ROTATE = 'rotate',
}

export enum LogLevel {
  CRITICAL = 'critical',
  ERROR = 'error',
  WARNING = 'warning',
  WARN = 'warn',
  INFO = 'info',
  NOTICE = 'notice',
  DEBUG = 'debug'
}
export const LogLevelColorFunMap = {
  [LogLevel.CRITICAL]: 'read',
  [LogLevel.ERROR]: 'cyan',
  [LogLevel.WARNING]: 'yellow',
  [LogLevel.WARN]: 'yellow',
  [LogLevel.INFO]: 'green',
  [LogLevel.NOTICE]: 'pink',
  [LogLevel.DEBUG]: 'blue',
}
export interface ConfiguredTransport {
  transport:Transport;
  options:LoggerOptions
}
export interface LoggerOptions {
  timeFormat?:string;
  colorize?:boolean;
  consoleOptions?:ConsoleTransportOptions;
  fileOptions?:DailyRotateFile.DailyRotateFileTransportOptions;
}
