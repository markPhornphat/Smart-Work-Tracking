import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  level: env.LOG_LEVEL,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  base: {
    pid: undefined,
    hostname: undefined,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});