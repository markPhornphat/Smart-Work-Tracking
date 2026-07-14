import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { hash } from 'argon2';
import { buildServer } from '../shared/interface/http/buildServer';
import { prisma } from '../shared/infrastructure/database/prisma';

describe('Auth + Tasks API', () => {
  let app: FastifyInstance;
  let accessToken: string;
  let refreshToken: string;
  let projectId: string;
  let email: string;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL required for integration tests');
    }

    const { app: built } = await buildServer();
    app = built;
    await app.ready();

    email = `user_${randomBytes(4).toString('hex')}@example.com`;
    const reg = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { email, password: 'TestPass123!', displayName: 'Test User' },
    });
    expect(reg.statusCode).toBe(201);
    const body = reg.json();
    accessToken = body.accessToken;
    refreshToken = body.refreshToken;

    const org = await prisma.organization.create({
      data: {
        name: 'Test Org',
        slug: `org-${randomBytes(3).toString('hex')}`,
        members: { create: { userId: body.user.id } },
      },
    });
    const ws = await prisma.workspace.create({
      data: {
        organizationId: org.id,
        name: 'WS',
        slug: `ws-${randomBytes(3).toString('hex')}`,
      },
    });
    const project = await prisma.project.create({
      data: {
        workspaceId: ws.id,
        name: 'P',
        key: `P${randomBytes(2).toString('hex').toUpperCase()}`,
      },
    });
    projectId = project.id;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should_reject_unauthorized_tasks', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/v1/tasks?projectId=${projectId}` });
    expect(res.statusCode).toBe(401);
  });

  it('should_return_me', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
      headers: { authorization: `Bearer ${accessToken}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().user.email).toBe(email);
  });

  it('should_refresh_token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().accessToken).toBeTruthy();
    accessToken = res.json().accessToken;
    refreshToken = res.json().refreshToken;
  });

  it('should_create_and_list_tasks', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/api/v1/tasks',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: { projectId, title: 'Integration task' },
    });
    expect(create.statusCode).toBe(201);

    const list = await app.inject({
      method: 'GET',
      url: `/api/v1/tasks?projectId=${projectId}`,
      headers: { authorization: `Bearer ${accessToken}` },
    });
    expect(list.statusCode).toBe(200);
    expect(list.json().items.length).toBeGreaterThan(0);
  });

  it('should_login_with_password', async () => {
    const pw = await hash('OtherPass99!');
    const loginEmail = `login_${randomBytes(3).toString('hex')}@example.com`;
    await prisma.user.create({
      data: { email: loginEmail, displayName: 'L', passwordHash: pw },
    });
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: loginEmail, password: 'OtherPass99!' },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().accessToken).toBeTruthy();
  });
});
