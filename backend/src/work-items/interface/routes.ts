import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { CreateWorkItem } from '../application/CreateWorkItem';
import { GetWorkItem } from '../application/GetWorkItem';
import { ListWorkItems } from '../application/ListWorkItems';
import { UpdateWorkItemStatus } from '../application/UpdateWorkItemStatus';
import { InMemoryProjectStore } from '../infrastructure/InMemoryProjectStore';
import { InMemoryWorkItemRepository } from '../infrastructure/InMemoryWorkItemRepository';

const createBodySchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1),
});

const listQuerySchema = z.object({
  projectId: z.string().min(1).optional(),
});

const statusBodySchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done']),
});

export interface WorkItemsModule {
  workItemRepository: InMemoryWorkItemRepository;
  projectStore: InMemoryProjectStore;
}

export function createWorkItemsModule(): WorkItemsModule {
  return {
    workItemRepository: new InMemoryWorkItemRepository(),
    projectStore: new InMemoryProjectStore(),
  };
}

export async function registerWorkItemRoutes(
  app: FastifyInstance,
  module: WorkItemsModule = createWorkItemsModule(),
): Promise<WorkItemsModule> {
  const create = new CreateWorkItem(module.workItemRepository, module.projectStore);
  const list = new ListWorkItems(module.workItemRepository);
  const get = new GetWorkItem(module.workItemRepository);
  const updateStatus = new UpdateWorkItemStatus(module.workItemRepository);

  app.post('/api/v1/work-items', async (request, reply) => {
    const body = createBodySchema.parse(request.body);
    const result = await create.execute(body);
    return reply.status(201).send(result);
  });

  app.get('/api/v1/work-items', async (request) => {
    const query = listQuerySchema.parse(request.query);
    return list.execute(query.projectId ? { projectId: query.projectId } : undefined);
  });

  app.get<{ Params: { id: string } }>('/api/v1/work-items/:id', async (request) => {
    return get.execute(request.params.id);
  });

  app.patch<{ Params: { id: string } }>('/api/v1/work-items/:id/status', async (request) => {
    const body = statusBodySchema.parse(request.body);
    return updateStatus.execute(request.params.id, body.status);
  });

  return module;
}
