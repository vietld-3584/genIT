type LogLevel = 'info' | 'warn' | 'error';

interface Logger {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

const formatMessage = (level: LogLevel, message: string, ...args: unknown[]): string => {
  const timestamp = new Date().toISOString();
  const formattedArgs = args.length > 0 ? ` ${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ')}` : '';
  
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${formattedArgs}`;
};

export const logger: Logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(formatMessage('info', message, ...args));
  },
  
  warn: (message: string, ...args: unknown[]) => {
    console.warn(formatMessage('warn', message, ...args));
  },
  
  error: (message: string, ...args: unknown[]) => {
    console.error(formatMessage('error', message, ...args));
  },
};

// @custom:start - Add custom logging methods or configuration here
// @custom:end
