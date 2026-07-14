import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildServer } from '../../shared/interface/http/buildServer';
import { SEED_PROJECT_ID } from '../infrastructure/InMemoryProjectStore';

describe('HTTP work-items + health', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    const built = await buildServer();
    app = built.app;
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should_return_ok_on_health', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });

  it('should_create_and_get_work_item', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/api/v1/work-items',
      payload: { projectId: SEED_PROJECT_ID, title: 'HTTP item' },
    });
    expect(create.statusCode).toBe(201);
    const body = create.json();
    expect(body.title).toBe('HTTP item');

    const get = await app.inject({ method: 'GET', url: `/api/v1/work-items/${body.id}` });
    expect(get.statusCode).toBe(200);
    expect(get.json().id).toBe(body.id);
  });

  it('should_return_validation_error_envelope', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/work-items',
      payload: { projectId: SEED_PROJECT_ID },
      headers: { 'x-trace-id': 'trace-test-1' },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe('VALIDATION_ERROR');
    expect(res.json().error.traceId).toBe('trace-test-1');
  });
});
