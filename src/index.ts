/**
 * Smart-Work-Tracking
 * Application Entry Point
 */

import { logger } from './shared/infrastructure/logger';
import { env } from './shared/infrastructure/config/env';

async function bootstrap() {
  try {
    logger.info({ nodeEnv: env.NODE_ENV }, 'Starting application...');
    
    // Feature initialization goes here
    
    logger.info('Application started successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to start application');
    process.exit(1);
  }
}

bootstrap();