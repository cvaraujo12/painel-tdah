import pino from 'pino'
import { monitoring } from './monitoring'

const config = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
  production: {
    formatters: {
      level: (label: string) => ({ level: label }),
    },
    hooks: {
      logMethod(inputArgs: any[], method: any) {
        if (inputArgs.length >= 2) {
          const arg1 = inputArgs.shift()
          const arg2 = inputArgs.shift()
          method.apply(this, [arg2, arg1, ...inputArgs])
        }
      },
    },
  },
  test: {
    enabled: false,
  },
}

const logger = pino(config[process.env.NODE_ENV || 'development'])

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

interface LogContext {
  [key: string]: unknown
  error?: Error
  userId?: string
  requestId?: string
}

class Logger {
  private static instance: Logger
  private env = process.env.NODE_ENV || 'development'

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(message: string, context?: LogContext): object {
    return {
      message,
      timestamp: new Date().toISOString(),
      environment: this.env,
      ...context,
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage(message, context)
    logger[level](formattedMessage)

    if (level === 'error' || level === 'fatal') {
      monitoring.captureError({
        message,
        context: context as Record<string, unknown>,
      })
    }
  }

  public trace(message: string, context?: LogContext) {
    this.log('trace', message, context)
  }

  public debug(message: string, context?: LogContext) {
    this.log('debug', message, context)
  }

  public info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  public warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  public error(message: string, context?: LogContext) {
    this.log('error', message, context)
  }

  public fatal(message: string, context?: LogContext) {
    this.log('fatal', message, context)
  }
}

export const log = Logger.getInstance() 