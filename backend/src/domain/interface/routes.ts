import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../shared/infrastructure/database/prisma';
import { authenticate } from '../../shared/interface/http/authHooks';
import { pageResult, paginate, paginationQuerySchema } from '../../shared/interface/http/pagination';
import {
  assertOrgMember,
  assertProjectAccess,
  assertWorkspaceAccess,
} from '../../shared/application/tenancy';
import { NotFoundError } from '../../shared/domain/errors';
import { applyProjectTemplate } from '../../projects/application/applyProjectTemplate';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

/** Query-string safe boolean (`"false"` must not coerce to true). */
const queryBoolean = z
  .union([z.boolean(), z.enum(['true', 'false', '1', '0'])])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (typeof value === 'boolean') return value;
    return value === 'true' || value === '1';
  });

export async function registerDomainRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', async (request) => {
    if (!request.url.startsWith('/api/v1/')) return;
    if (
      request.url.startsWith('/api/v1/auth/register') ||
      request.url.startsWith('/api/v1/auth/login') ||
      request.url.startsWith('/api/v1/auth/refresh')
    ) {
      return;
    }
    await authenticate(request, null as never);
  });

  // --- Organizations ---
  app.get('/api/v1/organizations', async (request) => {
    const memberships = await prisma.organizationMember.findMany({
      where: { userId: request.user.id },
      include: { organization: true },
    });
    return {
      items: memberships
        .filter((m) => !m.organization.deletedAt)
        .map((m) => m.organization),
    };
  });

  app.post('/api/v1/organizations', async (request, reply) => {
    const body = z
      .object({ name: z.string().min(1), slug: z.string().min(1).optional() })
      .parse(request.body);
    const slug = body.slug ?? slugify(body.name);
    const org = await prisma.organization.create({
      data: {
        name: body.name,
        slug,
        members: { create: { userId: request.user.id } },
      },
    });
    return reply.status(201).send(org);
  });

  app.get<{ Params: { id: string } }>('/api/v1/organizations/:id', async (request) => {
    await assertOrgMember(request.user.id, request.params.id);
    const org = await prisma.organization.findFirst({
      where: { id: request.params.id, deletedAt: null },
    });
    if (!org) throw new NotFoundError('Organization', request.params.id);
    return org;
  });

  // --- Workspaces ---
  app.get('/api/v1/workspaces', async (request) => {
    const query = z.object({ organizationId: z.string().uuid() }).parse(request.query);
    await assertOrgMember(request.user.id, query.organizationId);
    const items = await prisma.workspace.findMany({
      where: { organizationId: query.organizationId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
    return { items };
  });

  app.post('/api/v1/workspaces', async (request, reply) => {
    const body = z
      .object({
        organizationId: z.string().uuid(),
        name: z.string().min(1),
        slug: z.string().min(1).optional(),
      })
      .parse(request.body);
    await assertOrgMember(request.user.id, body.organizationId);
    const ws = await prisma.workspace.create({
      data: {
        organizationId: body.organizationId,
        name: body.name,
        slug: body.slug ?? slugify(body.name),
      },
    });
    return reply.status(201).send(ws);
  });

  app.get<{ Params: { id: string } }>('/api/v1/workspaces/:id', async (request) => {
    return assertWorkspaceAccess(request.user.id, request.params.id);
  });

  // --- Templates ---
  app.get('/api/v1/templates', async () => {
    const items = await prisma.projectTemplate.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
    return { items };
  });

  // --- Projects ---
  app.get('/api/v1/projects', async (request) => {
    const query = z
      .object({
        workspaceId: z.string().uuid(),
        archived: queryBoolean,
        favorite: queryBoolean,
      })
      .parse(request.query);
    await assertWorkspaceAccess(request.user.id, query.workspaceId);
    const items = await prisma.project.findMany({
      where: {
        workspaceId: query.workspaceId,
        deletedAt: null,
        ...(query.archived !== undefined ? { isArchived: query.archived } : {}),
        ...(query.favorite !== undefined ? { isFavorite: query.favorite } : {}),
      },
      orderBy: { updatedAt: 'desc' },
    });
    return { items };
  });

  app.post('/api/v1/projects', async (request, reply) => {
    const body = z
      .object({
        workspaceId: z.string().uuid(),
        name: z.string().min(1),
        key: z.string().min(1).max(16),
        description: z.string().optional(),
        templateKey: z.string().optional(),
      })
      .parse(request.body);
    await assertWorkspaceAccess(request.user.id, body.workspaceId);
    const project = await prisma.project.create({
      data: {
        workspaceId: body.workspaceId,
        name: body.name,
        key: body.key.toUpperCase(),
        description: body.description,
      },
    });
    await applyProjectTemplate(project.id, body.templateKey ?? 'blank');
    const full = await prisma.project.findUniqueOrThrow({ where: { id: project.id } });
    return reply.status(201).send(full);
  });

  app.get<{ Params: { id: string } }>('/api/v1/projects/:id', async (request) => {
    return assertProjectAccess(request.user.id, request.params.id);
  });

  app.patch<{ Params: { id: string } }>('/api/v1/projects/:id', async (request) => {
    await assertProjectAccess(request.user.id, request.params.id);
    const body = z
      .object({
        name: z.string().min(1).optional(),
        description: z.string().nullable().optional(),
        isFavorite: z.boolean().optional(),
        isArchived: z.boolean().optional(),
        lastViewType: z
          .enum(['BACKLOG', 'KANBAN', 'LIST', 'CALENDAR', 'TIMELINE', 'TABLE', 'DASHBOARD'])
          .optional(),
      })
      .parse(request.body);
    return prisma.project.update({ where: { id: request.params.id }, data: body });
  });

  app.delete<{ Params: { id: string } }>('/api/v1/projects/:id', async (request) => {
    await assertProjectAccess(request.user.id, request.params.id);
    await prisma.project.update({
      where: { id: request.params.id },
      data: { deletedAt: new Date() },
    });
    return { ok: true };
  });

  // --- Workflow / Statuses ---
  app.get<{ Params: { projectId: string } }>(
    '/api/v1/projects/:projectId/workflow',
    async (request) => {
      await assertProjectAccess(request.user.id, request.params.projectId);
      const workflow = await prisma.workflow.findUnique({
        where: { projectId: request.params.projectId },
        include: {
          statuses: {
            where: { deletedAt: null },
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
      if (!workflow) throw new NotFoundError('Workflow');
      return workflow;
    },
  );

  app.post<{ Params: { projectId: string } }>(
    '/api/v1/projects/:projectId/statuses',
    async (request, reply) => {
      await assertProjectAccess(request.user.id, request.params.projectId);
      const body = z
        .object({
          name: z.string().min(1),
          color: z.string().optional(),
          isDone: z.boolean().optional(),
        })
        .parse(request.body);
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { projectId: request.params.projectId },
      });
      const max = await prisma.workflowStatus.aggregate({
        where: { workflowId: workflow.id, deletedAt: null },
        _max: { sortOrder: true },
      });
      const status = await prisma.workflowStatus.create({
        data: {
          workflowId: workflow.id,
          name: body.name,
          color: body.color ?? '#6B7280',
          isDone: body.isDone ?? false,
          sortOrder: (max._max.sortOrder ?? -1) + 1,
        },
      });
      return reply.status(201).send(status);
    },
  );

  app.patch<{ Params: { id: string } }>('/api/v1/statuses/:id', async (request) => {
    const status = await prisma.workflowStatus.findFirst({
      where: { id: request.params.id, deletedAt: null },
      include: { workflow: true },
    });
    if (!status) throw new NotFoundError('WorkflowStatus', request.params.id);
    await assertProjectAccess(request.user.id, status.workflow.projectId);
    const body = z
      .object({
        name: z.string().min(1).optional(),
        color: z.string().optional(),
        isDone: z.boolean().optional(),
        isArchived: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
      })
      .parse(request.body);
    return prisma.workflowStatus.update({ where: { id: status.id }, data: body });
  });

  app.delete<{ Params: { id: string } }>('/api/v1/statuses/:id', async (request) => {
    const status = await prisma.workflowStatus.findFirst({
      where: { id: request.params.id, deletedAt: null },
      include: { workflow: true },
    });
    if (!status) throw new NotFoundError('WorkflowStatus', request.params.id);
    await assertProjectAccess(request.user.id, status.workflow.projectId);
    await prisma.workflowStatus.update({
      where: { id: status.id },
      data: { deletedAt: new Date() },
    });
    return { ok: true };
  });

  app.put<{ Params: { projectId: string } }>(
    '/api/v1/projects/:projectId/statuses/reorder',
    async (request) => {
      await assertProjectAccess(request.user.id, request.params.projectId);
      const body = z.object({ orderedIds: z.array(z.string().uuid()).min(1) }).parse(request.body);
      await prisma.$transaction(
        body.orderedIds.map((id, sortOrder) =>
          prisma.workflowStatus.update({ where: { id }, data: { sortOrder } }),
        ),
      );
      return { ok: true };
    },
  );

  // --- Sections ---
  app.get<{ Params: { projectId: string } }>(
    '/api/v1/projects/:projectId/sections',
    async (request) => {
      await assertProjectAccess(request.user.id, request.params.projectId);
      const items = await prisma.section.findMany({
        where: { projectId: request.params.projectId, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      });
      return { items };
    },
  );

  app.post<{ Params: { projectId: string } }>(
    '/api/v1/projects/:projectId/sections',
    async (request, reply) => {
      await assertProjectAccess(request.user.id, request.params.projectId);
      const body = z.object({ name: z.string().min(1) }).parse(request.body);
      const max = await prisma.section.aggregate({
        where: { projectId: request.params.projectId, deletedAt: null },
        _max: { sortOrder: true },
      });
      const section = await prisma.section.create({
        data: {
          projectId: request.params.projectId,
          name: body.name,
          sortOrder: (max._max.sortOrder ?? -1) + 1,
        },
      });
      return reply.status(201).send(section);
    },
  );

  app.patch<{ Params: { id: string } }>('/api/v1/sections/:id', async (request) => {
    const section = await prisma.section.findFirst({
      where: { id: request.params.id, deletedAt: null },
    });
    if (!section) throw new NotFoundError('Section', request.params.id);
    await assertProjectAccess(request.user.id, section.projectId);
    const body = z
      .object({
        name: z.string().min(1).optional(),
        isCollapsed: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
      })
      .parse(request.body);
    return prisma.section.update({ where: { id: section.id }, data: body });
  });

  app.delete<{ Params: { id: string } }>('/api/v1/sections/:id', async (request) => {
    const section = await prisma.section.findFirst({
      where: { id: request.params.id, deletedAt: null },
    });
    if (!section) throw new NotFoundError('Section', request.params.id);
    await assertProjectAccess(request.user.id, section.projectId);
    await prisma.section.update({
      where: { id: section.id },
      data: { deletedAt: new Date() },
    });
    return { ok: true };
  });

  // --- Tags ---
  app.get<{ Params: { projectId: string } }>(
    '/api/v1/projects/:projectId/tags',
    async (request) => {
      await assertProjectAccess(request.user.id, request.params.projectId);
      const items = await prisma.tag.findMany({
        where: { projectId: request.params.projectId, deletedAt: null },
        orderBy: { name: 'asc' },
      });
      return { items };
    },
  );

  app.post<{ Params: { projectId: string } }>(
    '/api/v1/projects/:projectId/tags',
    async (request, reply) => {
      await assertProjectAccess(request.user.id, request.params.projectId);
      const body = z
        .object({ name: z.string().min(1), color: z.string().optional() })
        .parse(request.body);
      const tag = await prisma.tag.create({
        data: {
          projectId: request.params.projectId,
          name: body.name,
          color: body.color ?? '#3B82F6',
        },
      });
      return reply.status(201).send(tag);
    },
  );

  app.patch<{ Params: { id: string } }>('/api/v1/tags/:id', async (request) => {
    const tag = await prisma.tag.findFirst({
      where: { id: request.params.id, deletedAt: null },
    });
    if (!tag) throw new NotFoundError('Tag', request.params.id);
    await assertProjectAccess(request.user.id, tag.projectId);
    const body = z
      .object({ name: z.string().min(1).optional(), color: z.string().optional() })
      .parse(request.body);
    return prisma.tag.update({ where: { id: tag.id }, data: body });
  });

  app.delete<{ Params: { id: string } }>('/api/v1/tags/:id', async (request) => {
    const tag = await prisma.tag.findFirst({
      where: { id: request.params.id, deletedAt: null },
    });
    if (!tag) throw new NotFoundError('Tag', request.params.id);
    await assertProjectAccess(request.user.id, tag.projectId);
    await prisma.tag.update({
      where: { id: tag.id },
      data: { deletedAt: new Date() },
    });
    return { ok: true };
  });

  // --- Tasks ---
  app.get('/api/v1/tasks', async (request) => {
    const query = paginationQuerySchema
      .extend({
        projectId: z.string().uuid(),
        statusId: z.string().uuid().optional(),
        sectionId: z.string().uuid().optional(),
        assigneeId: z.string().uuid().optional(),
        priority: z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
        parentTaskId: z.string().uuid().nullable().optional(),
      })
      .parse(request.query);
    await assertProjectAccess(request.user.id, query.projectId);
    const where = {
      projectId: query.projectId,
      deletedAt: null,
      ...(query.statusId ? { statusId: query.statusId } : {}),
      ...(query.sectionId ? { sectionId: query.sectionId } : {}),
      ...(query.assigneeId ? { assigneeId: query.assigneeId } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.parentTaskId === null
        ? { parentTaskId: null }
        : query.parentTaskId
          ? { parentTaskId: query.parentTaskId }
          : {}),
    };
    const [total, items] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        ...paginate(query.page, query.pageSize),
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: {
          status: true,
          section: true,
          tags: { include: { tag: true } },
          assignee: { select: { id: true, displayName: true, email: true } },
        },
      }),
    ]);
    return pageResult(
      items.map((task) => ({
        ...task,
        tags: task.tags.map((tt) => tt.tag).filter((t) => !t.deletedAt),
      })),
      total,
      query.page,
      query.pageSize,
    );
  });

  app.post('/api/v1/tasks', async (request, reply) => {
    const body = z
      .object({
        projectId: z.string().uuid(),
        title: z.string().min(1),
        description: z.string().optional(),
        sectionId: z.string().uuid().optional(),
        statusId: z.string().uuid().optional(),
        parentTaskId: z.string().uuid().optional(),
        priority: z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
        assigneeId: z.string().uuid().optional(),
        dueDate: z.string().datetime().optional(),
        startDate: z.string().datetime().optional(),
      })
      .parse(request.body);
    await assertProjectAccess(request.user.id, body.projectId);
    const task = await prisma.task.create({
      data: {
        projectId: body.projectId,
        title: body.title.trim(),
        description: body.description,
        sectionId: body.sectionId,
        statusId: body.statusId,
        parentTaskId: body.parentTaskId,
        priority: body.priority ?? 'NONE',
        assigneeId: body.assigneeId,
        reporterId: request.user.id,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
      },
    });
    await prisma.activityHistory.create({
      data: {
        taskId: task.id,
        actorId: request.user.id,
        action: 'CREATED',
        entityType: 'Task',
        entityId: task.id,
        metadata: {},
      },
    });
    return reply.status(201).send(task);
  });

  app.get<{ Params: { id: string } }>('/api/v1/tasks/:id', async (request) => {
    const task = await prisma.task.findFirst({
      where: { id: request.params.id, deletedAt: null },
      include: { children: { where: { deletedAt: null } } },
    });
    if (!task) throw new NotFoundError('Task', request.params.id);
    await assertProjectAccess(request.user.id, task.projectId);
    return task;
  });

  app.patch<{ Params: { id: string } }>('/api/v1/tasks/:id', async (request) => {
    const task = await prisma.task.findFirst({
      where: { id: request.params.id, deletedAt: null },
    });
    if (!task) throw new NotFoundError('Task', request.params.id);
    await assertProjectAccess(request.user.id, task.projectId);
    const body = z
      .object({
        title: z.string().min(1).optional(),
        description: z.string().nullable().optional(),
        sectionId: z.string().uuid().nullable().optional(),
        statusId: z.string().uuid().nullable().optional(),
        priority: z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
        assigneeId: z.string().uuid().nullable().optional(),
        dueDate: z.string().datetime().nullable().optional(),
        startDate: z.string().datetime().nullable().optional(),
        estimatedHours: z.number().optional(),
        actualHours: z.number().optional(),
        sortOrder: z.number().int().optional(),
        tagIds: z.array(z.string().uuid()).optional(),
      })
      .parse(request.body);

    const { tagIds, ...fields } = body;

    const updated = await prisma.task.update({
      where: { id: task.id },
      data: {
        ...fields,
        dueDate:
          fields.dueDate === undefined
            ? undefined
            : fields.dueDate
              ? new Date(fields.dueDate)
              : null,
        startDate:
          fields.startDate === undefined
            ? undefined
            : fields.startDate
              ? new Date(fields.startDate)
              : null,
      },
    });

    if (tagIds) {
      await prisma.taskTag.deleteMany({ where: { taskId: task.id } });
      if (tagIds.length > 0) {
        await prisma.taskTag.createMany({
          data: tagIds.map((tagId) => ({ taskId: task.id, tagId })),
          skipDuplicates: true,
        });
      }
    }

    const full = await prisma.task.findUniqueOrThrow({
      where: { id: updated.id },
      include: {
        status: true,
        section: true,
        tags: { include: { tag: true } },
        assignee: { select: { id: true, displayName: true, email: true } },
      },
    });
    return {
      ...full,
      tags: full.tags.map((tt) => tt.tag).filter((t) => !t.deletedAt),
    };
  });

  app.delete<{ Params: { id: string } }>('/api/v1/tasks/:id', async (request) => {
    const task = await prisma.task.findFirst({
      where: { id: request.params.id, deletedAt: null },
    });
    if (!task) throw new NotFoundError('Task', request.params.id);
    await assertProjectAccess(request.user.id, task.projectId);
    await prisma.task.update({
      where: { id: task.id },
      data: { deletedAt: new Date() },
    });
    return { ok: true };
  });

  // --- Comments ---
  app.get<{ Params: { taskId: string } }>('/api/v1/tasks/:taskId/comments', async (request) => {
    const task = await prisma.task.findFirst({
      where: { id: request.params.taskId, deletedAt: null },
    });
    if (!task) throw new NotFoundError('Task', request.params.taskId);
    await assertProjectAccess(request.user.id, task.projectId);
    const items = await prisma.comment.findMany({
      where: { taskId: task.id, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
    return { items };
  });

  app.post<{ Params: { taskId: string } }>(
    '/api/v1/tasks/:taskId/comments',
    async (request, reply) => {
      const task = await prisma.task.findFirst({
        where: { id: request.params.taskId, deletedAt: null },
      });
      if (!task) throw new NotFoundError('Task', request.params.taskId);
      await assertProjectAccess(request.user.id, task.projectId);
      const body = z.object({ body: z.string().min(1) }).parse(request.body);
      const comment = await prisma.comment.create({
        data: {
          taskId: task.id,
          authorId: request.user.id,
          body: body.body,
        },
      });
      return reply.status(201).send(comment);
    },
  );

  // --- Search ---
  app.get('/api/v1/search', async (request) => {
    const query = z.object({ q: z.string().min(1) }).parse(request.query);
    const q = query.q.trim();
    const memberships = await prisma.organizationMember.findMany({
      where: { userId: request.user.id },
      select: { organizationId: true },
    });
    const orgIds = memberships.map((m) => m.organizationId);
    if (orgIds.length === 0) {
      return { projects: [], tasks: [], sections: [], tags: [], comments: [] };
    }

    const workspaces = await prisma.workspace.findMany({
      where: { organizationId: { in: orgIds }, deletedAt: null },
      select: { id: true },
    });
    const workspaceIds = workspaces.map((w) => w.id);
    const projects = await prisma.project.findMany({
      where: {
        workspaceId: { in: workspaceIds },
        deletedAt: null,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { key: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
    const projectIds = (
      await prisma.project.findMany({
        where: { workspaceId: { in: workspaceIds }, deletedAt: null },
        select: { id: true },
      })
    ).map((p) => p.id);

    const [tasks, sections, tags, comments] = await Promise.all([
      prisma.task.findMany({
        where: {
          projectId: { in: projectIds },
          deletedAt: null,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 30,
      }),
      prisma.section.findMany({
        where: {
          projectId: { in: projectIds },
          deletedAt: null,
          name: { contains: q, mode: 'insensitive' },
        },
        take: 20,
      }),
      prisma.tag.findMany({
        where: {
          projectId: { in: projectIds },
          deletedAt: null,
          name: { contains: q, mode: 'insensitive' },
        },
        take: 20,
      }),
      prisma.comment.findMany({
        where: {
          deletedAt: null,
          body: { contains: q, mode: 'insensitive' },
          task: { projectId: { in: projectIds }, deletedAt: null },
        },
        take: 20,
      }),
    ]);

    return { projects, tasks, sections, tags, comments };
  });
}
