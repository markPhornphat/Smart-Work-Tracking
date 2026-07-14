import { createApp } from './createApp';
import { registerWorkItemRoutes, type WorkItemsModule } from '../../../work-items/interface/routes';
import type { FastifyInstance } from 'fastify';

export async function buildServer(): Promise<{ app: FastifyInstance; workItems: WorkItemsModule }> {
  const app = await createApp();
  const workItems = await registerWorkItemRoutes(app);
  return { app, workItems };
}
