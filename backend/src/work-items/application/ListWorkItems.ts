import type { WorkItemDto, WorkItemRepository } from './ports';
import { toWorkItemDto } from './ports';

export class ListWorkItems {
  constructor(private readonly workItems: WorkItemRepository) {}

  async execute(filter?: { projectId?: string }): Promise<{ items: WorkItemDto[] }> {
    const items = await this.workItems.list(filter);
    return { items: items.map(toWorkItemDto) };
  }
}
