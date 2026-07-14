import { useNavigate } from '@tanstack/react-router';
import {
  Archive,
  ArchiveRestore,
  FolderKanban,
  MoreHorizontal,
  Pencil,
  Plus,
  Star,
  StarOff,
} from 'lucide-react';
import { useState } from 'react';

import { DeleteProjectDialog } from '@/components/projects/delete-project-dialog';
import { ProjectFormDialog } from '@/components/projects/project-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useProjects,
  useUpdateProject,
  type ProjectListFilter,
} from '@/hooks/use-projects';
import { useWorkspaceContext } from '@/hooks/use-workspace-context';
import type { Project } from '@/lib/api';
import { persistence } from '@/lib/persistence';

export function ProjectsPage() {
  const navigate = useNavigate();
  const { workspace, workspaceId, organization } = useWorkspaceContext();
  const [filter, setFilter] = useState<ProjectListFilter>('active');
  const projectsQuery = useProjects(workspaceId, filter);
  const updateProject = useUpdateProject();

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  function openProject(project: Project) {
    persistence.setProjectId(project.id);
    void navigate({ to: '/projects/$projectId', params: { projectId: project.id } });
  }

  const items = projectsQuery.data ?? [];

  return (
    <main className="flex-1 px-4 py-6 md:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {organization?.name ?? 'Organization'} · {workspace?.name ?? 'Workspace'}
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight">Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create, favorite, archive, and open projects in this workspace.
            </p>
          </div>
          <Button type="button" onClick={() => setCreateOpen(true)} disabled={!workspaceId}>
            <Plus />
            Create project
          </Button>
        </header>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as ProjectListFilter)}>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4">
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              {projectsQuery.isLoading ? (
                <div className="space-y-3 p-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
                  <FolderKanban className="size-10 text-muted-foreground/60" />
                  <div>
                    <p className="font-semibold">No projects here</p>
                    <p className="text-sm text-muted-foreground">
                      {filter === 'active'
                        ? 'Create a project to start tracking work.'
                        : filter === 'favorites'
                          ? 'Star a project to pin it here.'
                          : 'Archived projects will show up in this tab.'}
                    </p>
                  </div>
                  {filter === 'active' ? (
                    <Button type="button" onClick={() => setCreateOpen(true)}>
                      <Plus />
                      Create project
                    </Button>
                  ) : null}
                </div>
              ) : (
                <ul className="divide-y">
                  {items.map((project) => (
                    <li
                      key={project.id}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                    >
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => openProject(project)}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {project.key}
                          </Badge>
                          <span className="font-medium">{project.name}</span>
                          {project.isFavorite ? (
                            <Star className="size-3.5 fill-amber-400 text-amber-500" />
                          ) : null}
                          {project.isArchived ? <Badge variant="muted">Archived</Badge> : null}
                        </div>
                        {project.description ? (
                          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                            {project.description}
                          </p>
                        ) : null}
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="button" size="icon" variant="ghost">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openProject(project)}>
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditProject(project)}>
                            <Pencil />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateProject.mutate({
                                id: project.id,
                                isFavorite: !project.isFavorite,
                              })
                            }
                          >
                            {project.isFavorite ? <StarOff /> : <Star />}
                            {project.isFavorite ? 'Unfavorite' : 'Favorite'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateProject.mutate({
                                id: project.id,
                                isArchived: !project.isArchived,
                              })
                            }
                          >
                            {project.isArchived ? <ArchiveRestore /> : <Archive />}
                            {project.isArchived ? 'Unarchive' : 'Archive'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteProject(project)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ProjectFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        workspaceId={workspaceId}
        mode="create"
        onCreated={openProject}
      />
      <ProjectFormDialog
        open={Boolean(editProject)}
        onOpenChange={(open) => !open && setEditProject(null)}
        workspaceId={workspaceId}
        mode="edit"
        project={editProject}
      />
      <DeleteProjectDialog
        project={deleteProject}
        open={Boolean(deleteProject)}
        onOpenChange={(open) => !open && setDeleteProject(null)}
      />
    </main>
  );
}
