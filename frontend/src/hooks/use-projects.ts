import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api, type Project, type ProjectTemplate } from '@/lib/api';

export type ProjectListFilter = 'active' | 'favorites' | 'archived';

export function projectQueryKey(workspaceId: string | null, filter: ProjectListFilter) {
  return ['projects', workspaceId, filter] as const;
}

function listUrl(workspaceId: string, filter: ProjectListFilter): string {
  const params = new URLSearchParams({ workspaceId });
  if (filter === 'favorites') params.set('favorite', 'true');
  if (filter === 'archived') params.set('archived', 'true');
  else if (filter === 'active') params.set('archived', 'false');
  return `/api/v1/projects?${params.toString()}`;
}

export function useProjects(workspaceId: string | null, filter: ProjectListFilter = 'active') {
  return useQuery({
    queryKey: projectQueryKey(workspaceId, filter),
    enabled: Boolean(workspaceId),
    queryFn: async () => {
      const res = await api<{ items: Project[] }>(listUrl(workspaceId!, filter));
      return res.items;
    },
  });
}

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project', projectId],
    enabled: Boolean(projectId),
    queryFn: async () => api<Project>(`/api/v1/projects/${projectId}`),
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const res = await api<{ items: ProjectTemplate[] }>('/api/v1/templates');
      return res.items;
    },
  });
}

function invalidateProjectLists(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['projects'] });
}

export function useCreateProject(workspaceId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      key: string;
      description?: string;
      templateKey?: string;
    }) => {
      if (!workspaceId) throw new Error('Select a workspace first');
      return api<Project>('/api/v1/projects', {
        method: 'POST',
        body: JSON.stringify({ workspaceId, ...input }),
      });
    },
    onSuccess: () => {
      invalidateProjectLists(queryClient);
      toast.success('Project created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      name?: string;
      description?: string | null;
      isFavorite?: boolean;
      isArchived?: boolean;
    }) => {
      const { id, ...body } = input;
      return api<Project>(`/api/v1/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    },
    onSuccess: (project) => {
      invalidateProjectLists(queryClient);
      queryClient.setQueryData(['project', project.id], project);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api<{ ok: boolean }>(`/api/v1/projects/${id}`, { method: 'DELETE' });
      return id;
    },
    onSuccess: (id) => {
      invalidateProjectLists(queryClient);
      queryClient.removeQueries({ queryKey: ['project', id] });
      toast.success('Project deleted from workspace');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
