import { useParams } from '@tanstack/react-router';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject } from '@/hooks/use-projects';
import { useCreateTask, useTasks } from '@/hooks/use-tasks';
import { persistence } from '@/lib/persistence';
import { cn } from '@/lib/utils';

function priorityVariant(priority: string): 'default' | 'secondary' | 'outline' | 'muted' {
  const value = priority.toLowerCase();
  if (value === 'high' || value === 'urgent') return 'default';
  if (value === 'medium') return 'secondary';
  return 'muted';
}

export function WorkTrackingPage() {
  const { projectId } = useParams({ from: '/_app/projects/$projectId' });
  const projectQuery = useProject(projectId);
  const tasksQuery = useTasks(projectId);
  const createTask = useCreateTask(projectId);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (projectId) persistence.setProjectId(projectId);
  }, [projectId]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    await createTask.mutateAsync(title.trim());
    setTitle('');
  }

  const project = projectQuery.data;
  const tasks = tasksQuery.data ?? [];

  return (
    <main className="flex-1 px-4 py-6 md:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Work tracking
          </p>
          {projectQuery.isLoading ? (
            <Skeleton className="mt-2 h-9 w-72" />
          ) : (
            <h1 className="truncate font-display text-2xl font-bold tracking-tight md:text-3xl">
              {project ? `${project.key} · ${project.name}` : 'Project not found'}
            </h1>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline">{tasks.length} tasks</Badge>
            {project?.isFavorite ? <Badge variant="secondary">Favorite</Badge> : null}
            {project?.isArchived ? <Badge variant="muted">Archived</Badge> : null}
          </div>
        </header>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 rounded-xl border bg-[linear-gradient(135deg,oklch(0.98_0.01_95),oklch(0.96_0.02_168))] p-4 sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              New task
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs doing?"
              required
              disabled={!project || createTask.isPending}
            />
          </div>
          <Button type="submit" disabled={!project || createTask.isPending || !title.trim()}>
            {createTask.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
            Add task
          </Button>
        </form>

        <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-sm font-semibold">Tasks</h2>
            {tasksQuery.isFetching ? (
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Refreshing
              </span>
            ) : null}
          </div>
          <Separator />
          <ScrollArea className="h-[min(60vh,560px)]">
            {tasksQuery.isLoading ? (
              <div className="space-y-3 p-4">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : (
              <ul className="divide-y">
                {tasks.map((task, index) => (
                  <li
                    key={task.id}
                    className={cn(
                      'flex items-start justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/40',
                      'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1',
                    )}
                    style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{task.title}</p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {project?.key}
                        {task.taskNumber != null ? `-${task.taskNumber}` : ''}
                      </p>
                    </div>
                    <Badge variant={priorityVariant(task.priority)} className="shrink-0 capitalize">
                      {task.priority}
                    </Badge>
                  </li>
                ))}
                {tasks.length === 0 ? (
                  <li className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No tasks yet. Add the first one above.
                  </li>
                ) : null}
              </ul>
            )}
          </ScrollArea>
        </section>
      </div>
    </main>
  );
}
