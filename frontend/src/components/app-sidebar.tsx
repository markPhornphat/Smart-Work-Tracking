import { Link, useNavigate } from '@tanstack/react-router';
import {
  Archive,
  FolderKanban,
  LayoutList,
  LogOut,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  Star,
  StarOff,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { DeleteProjectDialog } from '@/components/projects/delete-project-dialog';
import { ProjectFormDialog } from '@/components/projects/project-form-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useLogout, useMe } from '@/hooks/use-auth';
import { useProjects, useUpdateProject } from '@/hooks/use-projects';
import { useWorkspaceContext } from '@/hooks/use-workspace-context';
import type { Project } from '@/lib/api';
import { persistence } from '@/lib/persistence';
import { cn } from '@/lib/utils';

type AppSidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  activeProjectId?: string | null;
  className?: string;
};

export function AppSidebar({
  collapsed,
  onCollapsedChange,
  activeProjectId,
  className,
}: AppSidebarProps) {
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: user } = useMe();
  const {
    organizations,
    workspaces,
    organizationId,
    workspaceId,
    setOrganizationId,
    setWorkspaceId,
  } = useWorkspaceContext();

  const projectsQuery = useProjects(workspaceId, 'active');
  const favoritesQuery = useProjects(workspaceId, 'favorites');
  const updateProject = useUpdateProject();

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const favorites = favoritesQuery.data ?? [];
  const activeProjects = useMemo(() => {
    const favIds = new Set((favoritesQuery.data ?? []).map((p) => p.id));
    return (projectsQuery.data ?? []).filter((p) => !favIds.has(p.id));
  }, [projectsQuery.data, favoritesQuery.data]);

  const initials =
    user?.displayName
      ?.split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'SW';

  function openProject(projectId: string) {
    persistence.setProjectId(projectId);
    void navigate({ to: '/projects/$projectId', params: { projectId } });
  }

  return (
    <aside
      className={cn(
        'flex h-svh flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-out',
        collapsed ? 'w-[72px]' : 'w-64',
        className,
      )}
    >
      <div className={cn('flex items-center gap-3 px-3 py-4', collapsed && 'justify-center')}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
          SW
        </div>
        {!collapsed ? (
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-bold leading-tight">Smart-Work</p>
            <p className="truncate text-xs text-sidebar-foreground/70">Tracking</p>
          </div>
        ) : null}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="hidden h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:inline-flex"
          onClick={() => onCollapsedChange(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      {!collapsed ? (
        <div className="space-y-2 px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Context
          </p>
          <div className="space-y-1.5">
            <label className="text-xs text-[#89d6fb]">Organization</label>
            <Select
              value={organizationId ?? undefined}
              onValueChange={setOrganizationId}
              disabled={!organizations.length}
            >
              <SelectTrigger className="h-9 border-[#89d6fb] bg-[#02577a] text-[#d4f0fc] [&>svg]:text-[#d4f0fc]">
                <SelectValue placeholder="Select org" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#89d6fb]">Workspace</label>
            <Select
              value={workspaceId ?? undefined}
              onValueChange={setWorkspaceId}
              disabled={!workspaces.length}
            >
              <SelectTrigger className="h-9 border-[#89d6fb] bg-[#02577a] text-[#d4f0fc] [&>svg]:text-[#d4f0fc]">
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((ws) => (
                  <SelectItem key={ws.id} value={ws.id}>
                    {ws.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}

      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1 py-2">
          <Button
            type="button"
            variant="sidebar"
            className={cn('w-full', collapsed && 'justify-center px-0')}
            asChild
          >
            <Link to="/projects">
              <LayoutList />
              {!collapsed ? <span>All projects</span> : null}
            </Link>
          </Button>
          <Button
            type="button"
            variant="sidebar"
            className={cn('w-full', collapsed && 'justify-center px-0')}
            onClick={() => setCreateOpen(true)}
          >
            <Plus />
            {!collapsed ? <span>New project</span> : null}
          </Button>
        </nav>

        {!collapsed ? (
          <div className="space-y-4 px-1 pb-4 pt-1">
            <ProjectGroup
              title="Favorites"
              projects={favorites}
              activeProjectId={activeProjectId}
              onOpen={openProject}
              onEdit={setEditProject}
              onDelete={setDeleteProject}
              onToggleFavorite={(p) =>
                updateProject.mutate({ id: p.id, isFavorite: !p.isFavorite })
              }
              onToggleArchive={(p) =>
                updateProject.mutate({ id: p.id, isArchived: !p.isArchived })
              }
            />
            <ProjectGroup
              title="Projects"
              projects={activeProjects}
              activeProjectId={activeProjectId}
              onOpen={openProject}
              onEdit={setEditProject}
              onDelete={setDeleteProject}
              onToggleFavorite={(p) =>
                updateProject.mutate({ id: p.id, isFavorite: !p.isFavorite })
              }
              onToggleArchive={(p) =>
                updateProject.mutate({ id: p.id, isArchived: !p.isArchived })
              }
              emptyLabel="No active projects"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-2">
            {(favorites.length ? favorites : activeProjects).slice(0, 6).map((project) => (
              <Button
                key={project.id}
                type="button"
                size="icon"
                variant="ghost"
                className={cn(
                  'text-sidebar-foreground hover:bg-sidebar-accent',
                  project.id === activeProjectId && 'bg-sidebar-primary text-sidebar-primary-foreground',
                )}
                title={project.name}
                onClick={() => openProject(project.id)}
              >
                <FolderKanban />
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>

      <Separator className="bg-sidebar-border" />

      <div className={cn('p-3', collapsed && 'flex justify-center')}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                'h-auto w-full justify-start gap-3 px-2 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'w-auto justify-center px-2',
              )}
            >
              <Avatar className="h-8 w-8 border border-sidebar-border">
                <AvatarFallback className="bg-sidebar-accent text-xs text-sidebar-accent-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!collapsed ? (
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-semibold">{user?.displayName ?? 'User'}</p>
                  <p className="truncate text-xs text-sidebar-foreground/60">{user?.email ?? ''}</p>
                </div>
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProjectFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        workspaceId={workspaceId}
        mode="create"
        onCreated={(project) => openProject(project.id)}
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
        onDeleted={(id) => {
          if (id === activeProjectId) void navigate({ to: '/projects' });
        }}
      />
    </aside>
  );
}

function ProjectGroup({
  title,
  projects,
  activeProjectId,
  onOpen,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleArchive,
  emptyLabel,
}: {
  title: string;
  projects: Project[];
  activeProjectId?: string | null;
  onOpen: (id: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onToggleFavorite: (project: Project) => void;
  onToggleArchive: (project: Project) => void;
  emptyLabel?: string;
}) {
  return (
    <div>
      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
        {title}
      </p>
      <div className="space-y-1">
        {projects.map((project) => {
          const active = project.id === activeProjectId;
          return (
            <div
              key={project.id}
              className={cn(
                'group flex items-center gap-1 rounded-md pr-1',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <button
                type="button"
                onClick={() => onOpen(project.id)}
                className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-sm"
              >
                <Badge
                  variant="outline"
                  className={cn(
                    'border-[#89d6fb] bg-[#02577a] font-mono text-[10px] text-[#d4f0fc]',
                    active && 'border-[#01303f]/30 bg-white/90 text-[#01303f]',
                  )}
                >
                  {project.key}
                </Badge>
                <span className="truncate">{project.name}</span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={cn(
                      'h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100',
                      active
                        ? 'text-sidebar-primary-foreground hover:bg-sidebar-primary-foreground/10'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent',
                    )}
                  >
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onToggleFavorite(project)}>
                    {project.isFavorite ? <StarOff /> : <Star />}
                    {project.isFavorite ? 'Unfavorite' : 'Favorite'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleArchive(project)}>
                    <Archive />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(project)}>
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(project)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
        {projects.length === 0 && emptyLabel ? (
          <p className="px-2 text-xs text-sidebar-foreground/60">{emptyLabel}</p>
        ) : null}
      </div>
    </div>
  );
}
