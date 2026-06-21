type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

class Logger {
  private formatLog(level: LogLevel, message: string, meta?: Record<string, any>) {
    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      env: process.env.NODE_ENV || "development",
      ...meta,
    };

    return JSON.stringify(logData);
  }

  info(message: string, meta?: Record<string, any>) {
    console.log(this.formatLog("INFO", message, meta));
  }

  warn(message: string, meta?: Record<string, any>) {
    console.warn(this.formatLog("WARN", message, meta));
  }

  error(message: string, error?: unknown, meta?: Record<string, any>) {
    const errorMeta: Record<string, any> = {};

    if (error instanceof Error) {
      errorMeta.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error !== undefined) {
      errorMeta.error = error;
    }

    console.error(this.formatLog("ERROR", message, { ...errorMeta, ...meta }));
  }

  debug(message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV !== "production") {
      console.log(this.formatLog("DEBUG", message, meta));
    }
  }
}

export const logger = new Logger();
