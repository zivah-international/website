export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

class Logger {
  private level: LogLevel = LogLevel.INFO;

  setLevel(level: LogLevel) {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatMessage(level: string, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  }

  error(message: string, meta?: unknown) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, meta));
    }
  }

  warn(message: string, meta?: unknown) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, meta));
    }
  }

  info(message: string, meta?: unknown) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.warn(this.formatMessage('INFO', message, meta));
    }
  }

  debug(message: string, meta?: unknown) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.warn(this.formatMessage('DEBUG', message, meta));
    }
  }

  // Request logging middleware helper
  logRequest(method: string, url: string, statusCode: number, duration: number, userId?: string) {
    const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    const message = `${method} ${url} ${statusCode} ${duration}ms`;
    const meta = userId ? { userId } : undefined;

    if (level === LogLevel.WARN) {
      this.warn(message, meta);
    } else {
      this.info(message, meta);
    }
  }

  // Database operation logging
  logDatabase(operation: string, table: string, duration: number, error?: unknown) {
    const message = `DB ${operation} on ${table} took ${duration}ms`;
    if (error) {
      this.error(message, { error: error instanceof Error ? error.message : String(error) });
    } else {
      this.debug(message);
    }
  }
}

export const logger = new Logger();

// Set log level based on environment
if (process.env.NODE_ENV === 'development') {
  logger.setLevel(LogLevel.DEBUG);
} else if (process.env.NODE_ENV === 'production') {
  logger.setLevel(LogLevel.INFO);
}
