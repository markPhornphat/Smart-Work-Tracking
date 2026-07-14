import { beforeEach, describe, expect, it } from 'vitest';
import { CreateWorkItem } from './CreateWorkItem';
import { GetWorkItem } from './GetWorkItem';
import { ListWorkItems } from './ListWorkItems';
import { UpdateWorkItemStatus } from './UpdateWorkItemStatus';
import { InMemoryProjectStore, SEED_PROJECT_ID } from '../infrastructure/InMemoryProjectStore';
import { InMemoryWorkItemRepository } from '../infrastructure/InMemoryWorkItemRepository';
import { DomainError, NotFoundError } from '../../shared/domain/errors';

describe('WorkItem use cases', () => {
  let repo: InMemoryWorkItemRepository;
  let projects: InMemoryProjectStore;

  beforeEach(() => {
    repo = new InMemoryWorkItemRepository();
    projects = new InMemoryProjectStore();
  });

  it('should_create_list_get_and_update_status', async () => {
    const created = await new CreateWorkItem(repo, projects).execute({
      projectId: SEED_PROJECT_ID,
      title: 'Write tests',
    });

    expect(created.status).toBe('todo');

    const listed = await new ListWorkItems(repo).execute({ projectId: SEED_PROJECT_ID });
    expect(listed.items).toHaveLength(1);

    const fetched = await new GetWorkItem(repo).execute(created.id);
    expect(fetched.id).toBe(created.id);

    const updated = await new UpdateWorkItemStatus(repo).execute(created.id, 'in_progress');
    expect(updated.status).toBe('in_progress');
  });

  it('should_fail_when_project_missing', async () => {
    await expect(
      new CreateWorkItem(repo, projects).execute({ projectId: 'missing', title: 'X' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('should_fail_on_invalid_transition', async () => {
    const created = await new CreateWorkItem(repo, projects).execute({
      projectId: SEED_PROJECT_ID,
      title: 'Done first',
    });
    await new UpdateWorkItemStatus(repo).execute(created.id, 'done');
    await expect(new UpdateWorkItemStatus(repo).execute(created.id, 'todo')).rejects.toBeInstanceOf(
      DomainError,
    );
  });
});
