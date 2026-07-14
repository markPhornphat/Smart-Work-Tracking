import { useQuery } from '@tanstack/react-query';

import { api, type Section, type Workflow } from '@/lib/api';

export function useWorkflow(projectId: string | undefined) {
  return useQuery({
    queryKey: ['workflow', projectId],
    enabled: Boolean(projectId),
    queryFn: async () => api<Workflow>(`/api/v1/projects/${projectId}/workflow`),
  });
}

export function useSections(projectId: string | undefined) {
  return useQuery({
    queryKey: ['sections', projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const res = await api<{ items: Section[] }>(`/api/v1/projects/${projectId}/sections`);
      return res.items;
    },
  });
}
