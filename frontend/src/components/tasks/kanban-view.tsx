import { TagChip } from '@/components/tags/tag-chip';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task, WorkflowStatus } from '@/lib/api';

type KanbanViewProps = {
  projectKey: string;
  tasks: Task[];
  statuses: WorkflowStatus[];
  onMoveTask: (taskId: string, statusId: string) => void;
};

export function KanbanView({ projectKey, tasks, statuses, onMoveTask }: KanbanViewProps) {
  const columns = [
    ...statuses.filter((s) => !s.isArchived),
    {
      id: '__none__',
      name: 'No status',
      color: '#89d6fb',
      sortOrder: 999,
      isDone: false,
      isArchived: false,
    } satisfies WorkflowStatus & { id: string },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {columns.map((column) => {
        const columnTasks =
          column.id === '__none__'
            ? tasks.filter((t) => !t.statusId)
            : tasks.filter((t) => t.statusId === column.id);
        return (
          <section
            key={column.id}
            className="flex w-72 shrink-0 flex-col rounded-xl border border-[#89d6fb] bg-card shadow-sm"
          >
            <header
              className="flex items-center gap-2 rounded-t-xl px-3 py-2.5 text-sm font-semibold text-[#d4f0fc]"
              style={{ backgroundColor: column.id === '__none__' ? '#02577a' : column.color }}
            >
              <span className="truncate drop-shadow-sm">{column.name}</span>
              <Badge className="ml-auto border-transparent bg-black/20 text-white">
                {columnTasks.length}
              </Badge>
            </header>
            <ul className="flex max-h-[min(60vh,560px)] flex-col gap-2 overflow-y-auto p-2">
              {columnTasks.length === 0 ? (
                <li className="rounded-lg border border-dashed border-[#89d6fb] px-3 py-6 text-center text-xs text-[#02577a]">
                  Empty column
                </li>
              ) : (
                columnTasks.map((task) => (
                  <li
                    key={task.id}
                    className="rounded-lg border border-[#89d6fb] bg-[#d4f0fc]/40 p-3 shadow-sm"
                  >
                    <p className="font-medium text-[#01303f]">{task.title}</p>
                    <p className="mt-1 font-mono text-[11px] text-[#02577a]">
                      {projectKey}
                      {task.taskNumber != null ? `-${task.taskNumber}` : ''}
                    </p>
                    {(task.tags?.length ?? 0) > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {task.tags!.map((tag) => (
                          <TagChip key={tag.id} name={tag.name} color={tag.color} />
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-3">
                      <Select
                        value={task.statusId ?? '__none__'}
                        onValueChange={(value) => {
                          if (value === '__none__') return;
                          onMoveTask(task.id, value);
                        }}
                      >
                        <SelectTrigger className="h-8 border-[#89d6fb] bg-white text-xs">
                          <SelectValue placeholder="Move to…" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses
                            .filter((s) => !s.isArchived)
                            .map((status) => (
                              <SelectItem key={status.id} value={status.id}>
                                {status.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
