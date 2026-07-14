# Performance Considerations

## Indexes (initial)

- Hierarchy FKs with `deletedAt` for active-row scans.
- Task board filters: `(projectId, statusId)`, `(projectId, sectionId)`, `assigneeId`, `dueDate`.
- Activity and comments ordered by `createdAt`.

## Practices

- Prefer filtered queries with `deletedAt IS NULL`.
- Paginate task lists; avoid loading all activity/comments without limits.
- Custom field values are vertical (EAV-like); index `(customFieldId, taskId)` uniqueness already enforced.
- Future: partial indexes `WHERE deletedAt IS NULL`, BRIN on activity timestamps, read replicas for search/reporting.

## Scaling notes

Workspace/project sharding is not required at bootstrap. Keep tenant keys (`organizationId` / `workspaceId`) on hot paths for later isolation.
