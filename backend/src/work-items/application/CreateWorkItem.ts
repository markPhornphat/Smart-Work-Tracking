import { NotFoundError } from '../../shared/domain/errors';
import { WorkItem } from '../domain/WorkItem';
import type { ProjectLookup, WorkItemDto, WorkItemRepository } from './ports';
import { toWorkItemDto } from './ports';

export class CreateWorkItem {
  constructor(
    private readonly workItems: WorkItemRepository,
    private readonly projects: ProjectLookup,
  ) {}

  async execute(input: { projectId: string; title: string }): Promise<WorkItemDto> {
    const exists = await this.projects.exists(input.projectId);
    if (!exists) {
      throw new NotFoundError('Project', input.projectId);
    }

    const item = WorkItem.create(input);
    const saved = await this.workItems.save(item);
    return toWorkItemDto(saved);
  }
}
