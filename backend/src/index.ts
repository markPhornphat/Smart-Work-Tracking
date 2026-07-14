/**
 * Smart-Work-Tracking
 * Application Entry Point
 */

import { logger } from './shared/infrastructure/logger';
import { env } from './shared/infrastructure/config/env';
import { buildServer } from './shared/interface/http/buildServer';

async function bootstrap() {
  try {
    logger.info({ nodeEnv: env.NODE_ENV }, 'Starting application...');

    const { app } = await buildServer();
    await app.listen({ port: env.PORT, host: '0.0.0.0' });

    logger.info({ port: env.PORT }, 'Application started successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to start application');
    process.exit(1);
  }
}

bootstrap();
