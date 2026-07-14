import { DomainError } from '../../shared/domain/errors';

export type WorkItemStatus = 'todo' | 'in_progress' | 'done';

const ALLOWED_TRANSITIONS: Record<WorkItemStatus, readonly WorkItemStatus[]> = {
  todo: ['in_progress', 'done'],
  in_progress: ['todo', 'done'],
  done: ['in_progress'],
};

export const WORK_ITEM_STATUSES: readonly WorkItemStatus[] = ['todo', 'in_progress', 'done'];

export function isAllowedTransition(from: WorkItemStatus, to: WorkItemStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertValidTransition(from: WorkItemStatus, to: WorkItemStatus): void {
  if (!isAllowedTransition(from, to)) {
    throw new DomainError(`Cannot transition work item status from '${from}' to '${to}'`);
  }
}
