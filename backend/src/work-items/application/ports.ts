import type { WorkItem } from '../domain/WorkItem';
import type { WorkItemStatus } from '../domain/WorkItemStatus';

export interface WorkItemRepository {
  save(item: WorkItem): Promise<WorkItem>;
  findById(id: string): Promise<WorkItem | null>;
  list(filter?: { projectId?: string }): Promise<WorkItem[]>;
}

export interface ProjectLookup {
  exists(projectId: string): Promise<boolean>;
}

export interface WorkItemDto {
  id: string;
  projectId: string;
  title: string;
  status: WorkItemStatus;
  createdAt: string;
  updatedAt: string;
}

export function toWorkItemDto(item: WorkItem): WorkItemDto {
  const json = item.toJSON();
  return {
    id: json.id,
    projectId: json.projectId,
    title: json.title,
    status: json.status,
    createdAt: json.createdAt.toISOString(),
    updatedAt: json.updatedAt.toISOString(),
  };
}
