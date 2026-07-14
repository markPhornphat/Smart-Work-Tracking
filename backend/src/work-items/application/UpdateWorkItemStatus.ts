import { NotFoundError } from '../../shared/domain/errors';
import type { WorkItemStatus } from '../domain/WorkItemStatus';
import type { WorkItemDto, WorkItemRepository } from './ports';
import { toWorkItemDto } from './ports';

export class UpdateWorkItemStatus {
  constructor(private readonly workItems: WorkItemRepository) {}

  async execute(id: string, status: WorkItemStatus): Promise<WorkItemDto> {
    const item = await this.workItems.findById(id);
    if (!item) {
      throw new NotFoundError('WorkItem', id);
    }

    item.changeStatus(status);
    const saved = await this.workItems.save(item);
    return toWorkItemDto(saved);
  }
}
