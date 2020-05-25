import * as clc from 'cli-color';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { Injectable } from '@nestjs/common';
import { ConfiguredTransport, LoggerOptions, LoggerTransport, LogLevel, LogLevelColorFunMap } from './logger.interface';
import * as winston from 'winston';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';

@Injectable()
export class LoggerService {
  public static DEFAULT_TIME_FORMAT = "HH:mm:ss";
  public static DEFAULT_FILENAME = "-";

  private static DEFAULT_FILE_OPTIONS: DailyRotateFile.DailyRotateFileTransportOptions = {
    filename: LoggerService.DEFAULT_FILENAME,
    datePattern: "YYYY-MM-DD",
    zippedArchive: false,
    maxFiles: "10d",
    options: { flags: "a", mode: "0776" },
  };

  private static DEFAULT_CONSOLE_OPTIONS: ConsoleTransportOptions = {};

  private static DEFAULT_LOGGER_OPTIONS: LoggerOptions = {
    timeFormat: LoggerService.DEFAULT_TIME_FORMAT,
    fileOptions: LoggerService.DEFAULT_FILE_OPTIONS,
    consoleOptions: LoggerService.DEFAULT_CONSOLE_OPTIONS,
    colorize: true,
  };
  private logger: winston.Logger;
  private requestId: string;
  private context:string;

  constructor(level: string, loggers: ConfiguredTransport[]) {
    loggers.forEach(logger => logger.transport.format = this.defaultFormatter(logger.options));
    this.logger = winston.createLogger({
      level,
      transports: loggers.map(l => l.transport),
    });
  }
  public static getLoggers(transportNames:LoggerTransport[],options?:LoggerOptions):ConfiguredTransport[]{
    const loggers = []
    if (~transportNames.indexOf(LoggerTransport.CONSOLE)){
      loggers.push(LoggerService.console(options))
    }
    if (~transportNames.indexOf(LoggerTransport.ROTATE)){
      loggers.push(LoggerService.rotate(options))
    }
    return loggers
  }
  public static console(options:LoggerOptions):ConfiguredTransport{
    const defaultOptions = Object.assign({},LoggerService.DEFAULT_LOGGER_OPTIONS)
    const consoleLoggerOptions= Object.assign(defaultOptions,options)
    const consoleTransportOptions = Object.assign(defaultOptions.consoleOptions,consoleLoggerOptions)
    const transport = new winston.transports.Console(consoleTransportOptions)
    return {transport,options:consoleLoggerOptions}
  }
  public static rotate(options:LoggerOptions):ConfiguredTransport{
    const defaultOptions = Object.assign({},LoggerService.DEFAULT_LOGGER_OPTIONS)
    const fileLoggerOptions = Object.assign(defaultOptions,options)
    const fileTransportOptions = Object.assign(defaultOptions.fileOptions,fileLoggerOptions.fileOptions)

    if (fileTransportOptions.filename === LoggerService.DEFAULT_FILENAME){
      fileTransportOptions.filename = `app-%DATE%.log`
    }
    const transport = new DailyRotateFile(fileTransportOptions)
    return {transport,options:fileLoggerOptions}
  }

  setRequestId(id: string) {
    this.requestId = id;
  }
  getRequestId(){
    return this.requestId
  }
  setContext(ctx:string){
    this.context = ctx
  }
  critical(message: any, trace?: string, context?: string) {
    if (!message) return
    this.logger.crit(this.dataToString(message),[{context, reqId:this.requestId}])
    this.logger.crit(trace,[{context,reqId:this.requestId}])
  }
  error(message: any, trace?: string, context?: string) {
    if (!message) return

    this.logger.error(this.dataToString(message),[{context, reqId:this.requestId}])
    this.logger.error(trace,[{context,reqId:this.requestId}])
  }

  warning(message: any, context?: string): any {
    if (!message) return

    this.logger.warning(this.dataToString(message),[{context, reqId:this.requestId}])
  }
  warn(message: any, context?: string): any {
    if (!message) return

    this.logger.warning(this.dataToString(message),[{context, reqId:this.requestId}])
  }
  info(message: any, context?: string): any {
    if (!message) return

    this.logger.info(this.dataToString(message),[{context, reqId:this.requestId}])
  }
  log(msg: any, context?: string) {
    if (!msg) return
    this.info(this.dataToString(msg), context);
  }

  debug(msg: any, context?: string) {
    if (!msg) return
    this.logger.debug(this.dataToString(msg), [{ context, reqId: this.requestId }]);
  }



  private dataToString(msg:any){
    if (typeof msg.entries === 'function' &&typeof msg.forEach === 'function'){
      return msg.map((value,key)=>`${key}:${value}`)
    }
    return  msg
  }
  private defaultFormatter(options: LoggerOptions) {
    const colorize = options.colorize
    const format = winston.format.printf(info => {
      const level = colorize ? this.colorizeLevel(info.level as LogLevel) : `[${info.level.toLocaleUpperCase()}]`.padEnd(7)
      let msg = info.message
      if (typeof info.message === "object") {
        try {
          msg = JSON.stringify(msg, null, 2)
        } catch (e) {
        }
      }
      let reqId = ""
      let context = ""
      if (info["0"]) {
        const meta = info["0"]
        if (meta.reqId) {
          reqId = colorize ? clc.cyan(`[${meta.reqId}]`) : `[${meta.reqId}]`
        }
        const ctx = meta.context || this.context || null;
        if (ctx) {
          context = `[${ctx.substr(0, 20)}]`.padEnd(32)
          if (colorize) {
            context = clc.blackBright(context);
          }
        }
      }
      return `${info.timestamp} ${context}${level}${reqId} ${msg}`
    })
    return winston.format.combine(
      winston.format.timestamp({
        format:options.timeFormat
      }),
      format,
    )
  }
  private colorizeLevel(level:LogLevel){
    const colorFunc = LogLevelColorFunMap[level] ? clc[LogLevelColorFunMap[level]] : (msg:string)=>msg
    return colorFunc(`[${level.toLocaleUpperCase()}]`).padEnd(17)
  }
}
