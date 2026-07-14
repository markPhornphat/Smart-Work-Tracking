import { ChevronDown, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import { TagChip } from '@/components/tags/tag-chip';
import { Badge } from '@/components/ui/badge';
import type { Section, Task } from '@/lib/api';
import { cn } from '@/lib/utils';

type BacklogViewProps = {
  projectKey: string;
  tasks: Task[];
  sections: Section[];
};

export function BacklogView({ projectKey, tasks, sections }: BacklogViewProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const bySection = new Map<string, Task[]>();
    for (const section of sections) bySection.set(section.id, []);
    const unsectioned: Task[] = [];
    for (const task of tasks) {
      if (task.sectionId && bySection.has(task.sectionId)) {
        bySection.get(task.sectionId)!.push(task);
      } else {
        unsectioned.push(task);
      }
    }
    return [
      ...sections.map((section) => ({
        id: section.id,
        name: section.name,
        tasks: bySection.get(section.id) ?? [],
      })),
      { id: '__none__', name: 'No section', tasks: unsectioned },
    ].filter((g) => g.id !== '__none__' || g.tasks.length > 0 || sections.length === 0);
  }, [sections, tasks]);

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const isCollapsed = collapsed[group.id] ?? false;
        return (
          <section
            key={group.id}
            className="overflow-hidden rounded-xl border border-[#89d6fb] bg-card shadow-sm"
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 bg-[#02577a] px-4 py-2.5 text-left text-[#d4f0fc]"
              onClick={() =>
                setCollapsed((prev) => ({ ...prev, [group.id]: !isCollapsed }))
              }
            >
              {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4" />}
              <span className="font-semibold">{group.name}</span>
              <Badge className="ml-auto border-transparent bg-[#02a9f7] text-[#01303f]">
                {group.tasks.length}
              </Badge>
            </button>
            {!isCollapsed ? (
              <ul className="divide-y divide-[#89d6fb]/50">
                {group.tasks.length === 0 ? (
                  <li className="px-4 py-6 text-sm text-[#02577a]">No tasks in this section</li>
                ) : (
                  group.tasks.map((task) => (
                    <li
                      key={task.id}
                      className={cn('flex flex-wrap items-start justify-between gap-3 px-4 py-3')}
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[#01303f]">{task.title}</p>
                        <p className="mt-1 font-mono text-xs text-[#02577a]">
                          {projectKey}
                          {task.taskNumber != null ? `-${task.taskNumber}` : ''}
                          {task.status ? ` · ${task.status.name}` : ''}
                        </p>
                        {(task.tags?.length ?? 0) > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {task.tags!.map((tag) => (
                              <TagChip key={tag.id} name={tag.name} color={tag.color} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {task.priority.toLowerCase()}
                      </Badge>
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
