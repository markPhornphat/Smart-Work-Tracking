import { useParams } from '@tanstack/react-router';
import { Columns3, LayoutList, Loader2, Plus, Table2 } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';

import { BacklogView } from '@/components/tasks/backlog-view';
import { ColumnSettingsDialog } from '@/components/tasks/column-settings-dialog';
import { KanbanView } from '@/components/tasks/kanban-view';
import { TaskTable } from '@/components/tasks/task-table';
import { TagsManager } from '@/components/tags/tags-manager';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject, useUpdateProject } from '@/hooks/use-projects';
import { useCreateTask, useTasks, useUpdateTask } from '@/hooks/use-tasks';
import { useTags } from '@/hooks/use-tags';
import { useSections, useWorkflow } from '@/hooks/use-workflow';
import type { ProjectViewType } from '@/lib/api';
import { persistence } from '@/lib/persistence';
import { loadTaskColumns, saveTaskColumns, type TaskColumnConfig } from '@/lib/table-columns';
import { cn } from '@/lib/utils';

type UiView = 'TABLE' | 'BACKLOG' | 'KANBAN';

function toUiView(value?: string | null): UiView {
  if (value === 'BACKLOG' || value === 'KANBAN' || value === 'TABLE') return value;
  if (value === 'LIST') return 'BACKLOG';
  return 'TABLE';
}

export function WorkTrackingPage() {
  const { projectId } = useParams({ from: '/_app/projects/$projectId' });
  const projectQuery = useProject(projectId);
  const tasksQuery = useTasks(projectId);
  const tagsQuery = useTags(projectId);
  const workflowQuery = useWorkflow(projectId);
  const sectionsQuery = useSections(projectId);
  const createTask = useCreateTask(projectId);
  const updateTask = useUpdateTask(projectId);
  const updateProject = useUpdateProject();

  const [title, setTitle] = useState('');
  const [view, setView] = useState<UiView>('TABLE');
  const [columns, setColumns] = useState<TaskColumnConfig[]>([]);

  useEffect(() => {
    if (projectId) persistence.setProjectId(projectId);
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    setColumns(loadTaskColumns(projectId));
  }, [projectId]);

  useEffect(() => {
    if (projectQuery.data?.lastViewType) {
      setView(toUiView(projectQuery.data.lastViewType));
    }
  }, [projectQuery.data?.lastViewType]);

  const project = projectQuery.data;
  const tasks = tasksQuery.data ?? [];
  const statuses = useMemo(
    () => (workflowQuery.data?.statuses ?? []).filter((s) => !s.isArchived),
    [workflowQuery.data?.statuses],
  );
  const sections = sectionsQuery.data ?? [];
  const projectTags = tagsQuery.data ?? [];

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    await createTask.mutateAsync(title.trim());
    setTitle('');
  }

  function onColumnsChange(next: TaskColumnConfig[]) {
    setColumns(next);
    if (projectId) saveTaskColumns(projectId, next);
  }

  function switchView(next: UiView) {
    setView(next);
    if (projectId) {
      updateProject.mutate({ id: projectId, lastViewType: next as ProjectViewType });
    }
  }

  const views: { id: UiView; label: string; icon: typeof Table2 }[] = [
    { id: 'TABLE', label: 'Table', icon: Table2 },
    { id: 'BACKLOG', label: 'Backlog', icon: LayoutList },
    { id: 'KANBAN', label: 'Kanban', icon: Columns3 },
  ];

  return (
    <main className="flex-1 px-4 py-6 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#02577a]">
              Work tracking
            </p>
            {projectQuery.isLoading ? (
              <Skeleton className="mt-2 h-9 w-72" />
            ) : (
              <h1 className="truncate font-display text-2xl font-bold tracking-tight text-[#01303f] md:text-3xl">
                {project ? `${project.key} · ${project.name}` : 'Project not found'}
              </h1>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">{tasks.length} tasks</Badge>
              <Badge variant="secondary">{projectTags.length} tags</Badge>
              {project?.isFavorite ? <Badge>Favorite</Badge> : null}
              {project?.isArchived ? <Badge variant="muted">Archived</Badge> : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-[#89d6fb] bg-white/80 p-1 shadow-sm">
              {views.map((item) => {
                const Icon = item.icon;
                const active = view === item.id;
                return (
                  <Button
                    key={item.id}
                    type="button"
                    size="sm"
                    variant={active ? 'default' : 'ghost'}
                    className={cn(!active && 'text-[#02577a]')}
                    onClick={() => switchView(item.id)}
                  >
                    <Icon />
                    {item.label}
                  </Button>
                );
              })}
            </div>
            {view === 'TABLE' ? (
              <ColumnSettingsDialog columns={columns} onChange={onColumnsChange} />
            ) : null}
          </div>
        </header>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 rounded-xl border border-[#89d6fb] bg-gradient-to-br from-[#d4f0fc] to-[#89d6fb]/40 p-4 sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-[#01303f]">
              New task
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs doing?"
              required
              disabled={!project || createTask.isPending}
              className="bg-white"
            />
          </div>
          <Button type="submit" disabled={!project || createTask.isPending || !title.trim()}>
            {createTask.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
            Add task
          </Button>
        </form>

        {projectId ? <TagsManager projectId={projectId} /> : null}

        {tasksQuery.isLoading || workflowQuery.isLoading || sectionsQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : view === 'TABLE' ? (
          <TaskTable
            projectKey={project?.key ?? 'PRJ'}
            tasks={tasks}
            columns={columns}
            statuses={statuses}
            sections={sections}
            projectTags={projectTags}
            onUpdateTask={(input) => updateTask.mutate(input)}
          />
        ) : view === 'BACKLOG' ? (
          <BacklogView
            projectKey={project?.key ?? 'PRJ'}
            tasks={tasks}
            sections={sections}
          />
        ) : (
          <KanbanView
            projectKey={project?.key ?? 'PRJ'}
            tasks={tasks}
            statuses={statuses}
            onMoveTask={(taskId, statusId) =>
              updateTask.mutate({ id: taskId, statusId })
            }
          />
        )}
      </div>
    </main>
  );
}
