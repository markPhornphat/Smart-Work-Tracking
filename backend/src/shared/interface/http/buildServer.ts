import type { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { createApp } from './createApp';
import { env } from '../../infrastructure/config/env';
import { registerAuthRoutes } from '../../../auth/interface/routes';
import { registerDomainRoutes } from '../../../domain/interface/routes';

export async function buildServer(): Promise<{ app: FastifyInstance }> {
  const app = await createApp();

  await app.register(fastifyJwt, {
    secret: env.JWT_ACCESS_SECRET,
  });

  await registerAuthRoutes(app);
  await registerDomainRoutes(app);

  return { app };
}
