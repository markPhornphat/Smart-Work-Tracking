import { NotFoundError } from '../../shared/domain/errors';
import type { WorkItemDto, WorkItemRepository } from './ports';
import { toWorkItemDto } from './ports';

export class GetWorkItem {
  constructor(private readonly workItems: WorkItemRepository) {}

  async execute(id: string): Promise<WorkItemDto> {
    const item = await this.workItems.findById(id);
    if (!item) {
      throw new NotFoundError('WorkItem', id);
    }
    return toWorkItemDto(item);
  }
}
