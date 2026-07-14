import { randomUUID } from 'node:crypto';
import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { mapErrorToResponse } from '../errorMapper';
import { AppError, ValidationError } from '../../domain/errors';
import { ZodError } from 'zod';
import { checkDatabaseConnection } from '../../infrastructure/database/prisma';

declare module 'fastify' {
  interface FastifyRequest {
    traceId: string;
  }
}

export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false,
  });

  await app.register(cors);

  app.addHook('onRequest', async (request) => {
    const header = request.headers['x-trace-id'];
    request.traceId = typeof header === 'string' && header.length > 0 ? header : randomUUID();
  });

  app.setErrorHandler((error, request, reply) => {
    let mappedError: Error = error;

    if (error instanceof ZodError) {
      const details: Record<string, string[]> = {};
      for (const issue of error.issues) {
        const key = issue.path.join('.') || '_';
        details[key] = details[key] ?? [];
        details[key].push(issue.message);
      }
      mappedError = new ValidationError('Request validation failed', details);
    } else if (!(error instanceof AppError) && error instanceof Error) {
      mappedError = error;
    } else if (!(error instanceof Error)) {
      mappedError = new Error(String(error));
    }

    const { statusCode, payload } = mapErrorToResponse(mappedError, request.traceId);
    return reply.status(statusCode).send(payload);
  });

  app.get('/health', async () => {
    const database = await checkDatabaseConnection();
    return { status: 'ok', database };
  });

  return app;
}
