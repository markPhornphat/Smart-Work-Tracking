import { TagChip } from '@/components/tags/tag-chip';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Section, Tag, Task, WorkflowStatus } from '@/lib/api';
import type { TaskColumnConfig } from '@/lib/table-columns';
import { cn } from '@/lib/utils';

type TaskTableProps = {
  projectKey: string;
  tasks: Task[];
  columns: TaskColumnConfig[];
  statuses: WorkflowStatus[];
  sections: Section[];
  projectTags: Tag[];
  onUpdateTask: (input: {
    id: string;
    statusId?: string | null;
    sectionId?: string | null;
    priority?: string;
    tagIds?: string[];
  }) => void;
};

export function TaskTable({
  projectKey,
  tasks,
  columns,
  statuses,
  sections,
  projectTags,
  onUpdateTask,
}: TaskTableProps) {
  const visible = columns.filter((c) => c.visible);

  return (
    <div className="overflow-auto rounded-xl border border-[#89d6fb] bg-card shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead className="bg-[#02577a] text-[#d4f0fc]">
          <tr>
            {visible.map((col) => (
              <th
                key={col.id}
                className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={visible.length || 1} className="px-4 py-12 text-center text-[#02577a]">
                No tasks yet. Add the first one above.
              </td>
            </tr>
          ) : (
            tasks.map((task, index) => (
              <tr
                key={task.id}
                className={cn(
                  'border-t border-[#89d6fb]/60 transition-colors hover:bg-[#d4f0fc]/50',
                  index % 2 === 1 && 'bg-[#d4f0fc]/25',
                )}
              >
                {visible.map((col) => (
                  <td key={col.id} className="px-3 py-2 align-middle text-[#01303f]">
                    <Cell
                      columnId={col.id}
                      task={task}
                      projectKey={projectKey}
                      statuses={statuses}
                      sections={sections}
                      projectTags={projectTags}
                      onUpdateTask={onUpdateTask}
                    />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Cell({
  columnId,
  task,
  projectKey,
  statuses,
  sections,
  projectTags,
  onUpdateTask,
}: {
  columnId: string;
  task: Task;
  projectKey: string;
  statuses: WorkflowStatus[];
  sections: Section[];
  projectTags: Tag[];
  onUpdateTask: TaskTableProps['onUpdateTask'];
}) {
  switch (columnId) {
    case 'key':
      return (
        <span className="font-mono text-xs font-semibold text-[#02577a]">
          {projectKey}
          {task.taskNumber != null ? `-${task.taskNumber}` : ''}
        </span>
      );
    case 'title':
      return <span className="font-medium">{task.title}</span>;
    case 'status':
      return (
        <Select
          value={task.statusId ?? '__none__'}
          onValueChange={(value) =>
            onUpdateTask({ id: task.id, statusId: value === '__none__' ? null : value })
          }
        >
          <SelectTrigger className="h-8 w-[140px] border-[#89d6fb] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">None</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'priority':
      return (
        <Select
          value={task.priority}
          onValueChange={(value) => onUpdateTask({ id: task.id, priority: value })}
        >
          <SelectTrigger className="h-8 w-[120px] border-[#89d6fb] bg-white capitalize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['NONE', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
              <SelectItem key={p} value={p} className="capitalize">
                {p.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'tags':
      return (
        <div className="flex min-w-[160px] flex-wrap gap-1">
          {projectTags.map((tag) => {
            const selected = (task.tags ?? []).some((t) => t.id === tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                className={cn(
                  'rounded-md transition-opacity',
                  selected ? 'opacity-100' : 'opacity-35 hover:opacity-70',
                )}
                onClick={() => {
                  const current = (task.tags ?? []).map((t) => t.id);
                  const next = selected
                    ? current.filter((id) => id !== tag.id)
                    : [...current, tag.id];
                  onUpdateTask({ id: task.id, tagIds: next });
                }}
                title={selected ? `Remove ${tag.name}` : `Add ${tag.name}`}
              >
                <TagChip name={tag.name} color={tag.color} />
              </button>
            );
          })}
          {projectTags.length === 0 ? (
            <span className="text-xs text-[#02577a]">No tags</span>
          ) : null}
        </div>
      );
    case 'section':
      return (
        <Select
          value={task.sectionId ?? '__none__'}
          onValueChange={(value) =>
            onUpdateTask({ id: task.id, sectionId: value === '__none__' ? null : value })
          }
        >
          <SelectTrigger className="h-8 w-[140px] border-[#89d6fb] bg-white">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">None</SelectItem>
            {sections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                {section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'dueDate':
      return (
        <span className="text-xs text-[#02577a]">
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
        </span>
      );
    case 'assignee':
      return (
        <span className="text-xs">
          {task.assignee?.displayName ?? <Badge variant="muted">Unassigned</Badge>}
        </span>
      );
    default:
      return null;
  }
}
