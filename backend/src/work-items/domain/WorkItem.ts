import { randomUUID } from 'node:crypto';
import { ValidationError } from '../../shared/domain/errors';
import { assertValidTransition, type WorkItemStatus } from './WorkItemStatus';

export interface WorkItemProps {
  id: string;
  projectId: string;
  title: string;
  status: WorkItemStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class WorkItem {
  private constructor(private props: WorkItemProps) {}

  static create(input: { projectId: string; title: string }): WorkItem {
    const title = input.title.trim();
    if (!title) {
      throw new ValidationError('Work item title is required', {
        title: ['Title must be a non-empty string'],
      });
    }
    if (!input.projectId.trim()) {
      throw new ValidationError('projectId is required', {
        projectId: ['projectId must be a non-empty string'],
      });
    }

    const now = new Date();
    return new WorkItem({
      id: `wi_${randomUUID()}`,
      projectId: input.projectId,
      title,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    });
  }

  static rehydrate(props: WorkItemProps): WorkItem {
    return new WorkItem({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get title(): string {
    return this.props.title;
  }

  get status(): WorkItemStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  changeStatus(next: WorkItemStatus): void {
    assertValidTransition(this.props.status, next);
    this.props = {
      ...this.props,
      status: next,
      updatedAt: new Date(),
    };
  }

  toJSON(): WorkItemProps {
    return { ...this.props };
  }
}
