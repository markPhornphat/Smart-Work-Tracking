import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api, type Task } from '@/lib/api';

export function useTasks(projectId: string | undefined) {
  return useQuery({
    queryKey: ['tasks', projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const res = await api<{ items: Task[] }>(
        `/api/v1/tasks?projectId=${projectId}&pageSize=100`,
      );
      return res.items;
    },
  });
}

export function useCreateTask(projectId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!projectId) throw new Error('No project selected');
      return api('/api/v1/tasks', {
        method: 'POST',
        body: JSON.stringify({ projectId, title }),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Task added');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateTask(projectId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      title?: string;
      statusId?: string | null;
      sectionId?: string | null;
      priority?: string;
      tagIds?: string[];
      dueDate?: string | null;
    }) => {
      const { id, ...body } = input;
      return api<Task>(`/api/v1/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
