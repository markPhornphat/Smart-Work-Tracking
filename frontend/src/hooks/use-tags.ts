import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api, type Tag } from '@/lib/api';

export function useTags(projectId: string | undefined) {
  return useQuery({
    queryKey: ['tags', projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const res = await api<{ items: Tag[] }>(`/api/v1/projects/${projectId}/tags`);
      return res.items;
    },
  });
}

export function useCreateTag(projectId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; color?: string }) => {
      if (!projectId) throw new Error('No project selected');
      return api<Tag>(`/api/v1/projects/${projectId}/tags`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tags', projectId] });
      toast.success('Tag created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateTag(projectId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; name?: string; color?: string }) => {
      const { id, ...body } = input;
      return api<Tag>(`/api/v1/tags/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tags', projectId] });
      void queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Tag updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteTag(projectId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api(`/api/v1/tags/${id}`, { method: 'DELETE' });
      return id;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tags', projectId] });
      void queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Tag deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
