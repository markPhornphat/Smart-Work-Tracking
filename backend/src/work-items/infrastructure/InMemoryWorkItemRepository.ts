import { WorkItem } from '../domain/WorkItem';
import type { WorkItemRepository } from '../application/ports';

export class InMemoryWorkItemRepository implements WorkItemRepository {
  private readonly items = new Map<string, WorkItem>();

  async save(item: WorkItem): Promise<WorkItem> {
    this.items.set(item.id, item);
    return item;
  }

  async findById(id: string): Promise<WorkItem | null> {
    return this.items.get(id) ?? null;
  }

  async list(filter?: { projectId?: string }): Promise<WorkItem[]> {
    const all = Array.from(this.items.values());
    if (!filter?.projectId) {
      return all;
    }
    return all.filter((item) => item.projectId === filter.projectId);
  }

  clear(): void {
    this.items.clear();
  }
}
