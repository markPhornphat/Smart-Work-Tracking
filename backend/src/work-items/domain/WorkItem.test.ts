import { describe, expect, it } from 'vitest';
import { DomainError } from '../../shared/domain/errors';
import { assertValidTransition, isAllowedTransition } from './WorkItemStatus';
import { WorkItem } from './WorkItem';

describe('WorkItemStatus', () => {
  it('should_allow_todo_to_in_progress', () => {
    expect(isAllowedTransition('todo', 'in_progress')).toBe(true);
  });

  it('should_reject_done_to_todo', () => {
    expect(isAllowedTransition('done', 'todo')).toBe(false);
    expect(() => assertValidTransition('done', 'todo')).toThrow(DomainError);
  });
});

describe('WorkItem', () => {
  it('should_create_with_todo_status_when_title_provided', () => {
    const item = WorkItem.create({ projectId: 'proj_default', title: ' Ship feature ' });
    expect(item.title).toBe('Ship feature');
    expect(item.status).toBe('todo');
  });

  it('should_reject_empty_title', () => {
    expect(() => WorkItem.create({ projectId: 'proj_default', title: '   ' })).toThrow();
  });

  it('should_change_status_along_allowed_path', () => {
    const item = WorkItem.create({ projectId: 'proj_default', title: 'Task' });
    item.changeStatus('in_progress');
    item.changeStatus('done');
    item.changeStatus('in_progress');
    expect(item.status).toBe('in_progress');
  });
});
