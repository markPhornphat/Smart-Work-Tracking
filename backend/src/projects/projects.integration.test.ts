import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildServer } from '../shared/interface/http/buildServer';
import { prisma } from '../shared/infrastructure/database/prisma';

describe('Projects API (Phase 2.1)', () => {
  let app: FastifyInstance;
  let accessToken: string;
  let workspaceId: string;
  let projectId: string;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL required for integration tests');
    }

    const { app: built } = await buildServer();
    app = built;
    await app.ready();

    const email = `proj_${randomBytes(4).toString('hex')}@example.com`;
    const reg = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { email, password: 'TestPass123!', displayName: 'Project Tester' },
    });
    expect(reg.statusCode).toBe(201);
    accessToken = reg.json().accessToken;
    const userId = reg.json().user.id as string;

    const org = await prisma.organization.create({
      data: {
        name: 'Project Org',
        slug: `porg-${randomBytes(3).toString('hex')}`,
        members: { create: { userId } },
      },
    });
    const ws = await prisma.workspace.create({
      data: {
        organizationId: org.id,
        name: 'Project WS',
        slug: `pws-${randomBytes(3).toString('hex')}`,
      },
    });
    workspaceId = ws.id;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should_create_list_favorite_archive_and_soft_delete_project', async () => {
    const key = `K${randomBytes(2).toString('hex').toUpperCase()}`;
    const create = await app.inject({
      method: 'POST',
      url: '/api/v1/projects',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: {
        workspaceId,
        name: 'Lifecycle Project',
        key,
        description: 'Phase 2.1 test',
        templateKey: 'blank',
      },
    });
    expect(create.statusCode).toBe(201);
    projectId = create.json().id;
    expect(create.json().isFavorite).toBe(false);
    expect(create.json().isArchived).toBe(false);

    const listed = await app.inject({
      method: 'GET',
      url: `/api/v1/projects?workspaceId=${workspaceId}&archived=false`,
      headers: { authorization: `Bearer ${accessToken}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().items.some((p: { id: string }) => p.id === projectId)).toBe(true);

    const favorite = await app.inject({
      method: 'PATCH',
      url: `/api/v1/projects/${projectId}`,
      headers: { authorization: `Bearer ${accessToken}` },
      payload: { isFavorite: true },
    });
    expect(favorite.statusCode).toBe(200);
    expect(favorite.json().isFavorite).toBe(true);

    const favList = await app.inject({
      method: 'GET',
      url: `/api/v1/projects?workspaceId=${workspaceId}&favorite=true`,
      headers: { authorization: `Bearer ${accessToken}` },
    });
    expect(favList.json().items.some((p: { id: string }) => p.id === projectId)).toBe(true);

    const archive = await app.inject({
      method: 'PATCH',
      url: `/api/v1/projects/${projectId}`,
      headers: { authorization: `Bearer ${accessToken}` },
      payload: { isArchived: true, name: 'Lifecycle Project Archived' },
    });
    expect(archive.statusCode).toBe(200);
    expect(archive.json().isArchived).toBe(true);
    expect(archive.json().name).toBe('Lifecycle Project Archived');

    const activeList = await app.inject({
      method: 'GET',
      url: `/api/v1/projects?workspaceId=${workspaceId}&archived=false`,
      headers: { authorization: `Bearer ${accessToken}` },
    });
    expect(activeList.json().items.some((p: { id: string }) => p.id === projectId)).toBe(false);

    const archivedList = await app.inject({
      method: 'GET',
      url: `/api/v1/projects?workspaceId=${workspaceId}&archived=true`,
      headers: { authorization: `Bearer ${accessToken}` },
    });
    expect(archivedList.json().items.some((p: { id: string }) => p.id === projectId)).toBe(true);

    const del = await app.inject({
      method: 'DELETE',
      url: `/api/v1/projects/${projectId}`,
      headers: { authorization: `Bearer ${accessToken}` },
    });
    expect(del.statusCode).toBe(200);

    const afterDelete = await app.inject({
      method: 'GET',
      url: `/api/v1/projects?workspaceId=${workspaceId}`,
      headers: { authorization: `Bearer ${accessToken}` },
    });
    expect(afterDelete.json().items.some((p: { id: string }) => p.id === projectId)).toBe(false);

    const row = await prisma.project.findUniqueOrThrow({ where: { id: projectId } });
    expect(row.deletedAt).not.toBeNull();
  });
});
