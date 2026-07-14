import { useQuery } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { api, type Organization, type Workspace } from '@/lib/api';
import { persistence } from '@/lib/persistence';

type WorkspaceContextValue = {
  organizations: Organization[];
  workspaces: Workspace[];
  organizationId: string | null;
  workspaceId: string | null;
  organization: Organization | null;
  workspace: Workspace | null;
  orgsLoading: boolean;
  workspacesLoading: boolean;
  setOrganizationId: (id: string) => void;
  setWorkspaceId: (id: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function pickId(preferred: string | null, items: { id: string }[]): string | null {
  if (preferred && items.some((item) => item.id === preferred)) return preferred;
  return items[0]?.id ?? null;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [organizationId, setOrganizationIdState] = useState<string | null>(() =>
    persistence.getOrgId(),
  );
  const [workspaceId, setWorkspaceIdState] = useState<string | null>(() =>
    persistence.getWorkspaceId(),
  );

  const orgsQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await api<{ items: Organization[] }>('/api/v1/organizations');
      return res.items;
    },
  });

  useEffect(() => {
    if (!orgsQuery.data?.length) return;
    const next = pickId(organizationId, orgsQuery.data);
    if (next !== organizationId) {
      setOrganizationIdState(next);
      persistence.setOrgId(next);
    }
  }, [orgsQuery.data, organizationId]);

  const workspacesQuery = useQuery({
    queryKey: ['workspaces', organizationId],
    enabled: Boolean(organizationId),
    queryFn: async () => {
      const res = await api<{ items: Workspace[] }>(
        `/api/v1/workspaces?organizationId=${organizationId}`,
      );
      return res.items;
    },
  });

  useEffect(() => {
    if (!workspacesQuery.data) return;
    const next = pickId(workspaceId, workspacesQuery.data);
    if (next !== workspaceId) {
      setWorkspaceIdState(next);
      persistence.setWorkspaceId(next);
    }
  }, [workspacesQuery.data, workspaceId]);

  const setOrganizationId = useCallback((id: string) => {
    setOrganizationIdState(id);
    persistence.setOrgId(id);
    setWorkspaceIdState(null);
    persistence.setWorkspaceId(null);
    persistence.setProjectId(null);
  }, []);

  const setWorkspaceId = useCallback((id: string) => {
    setWorkspaceIdState(id);
    persistence.setWorkspaceId(id);
    persistence.setProjectId(null);
  }, []);

  const value = useMemo<WorkspaceContextValue>(() => {
    const organizations = orgsQuery.data ?? [];
    const workspaces = workspacesQuery.data ?? [];
    return {
      organizations,
      workspaces,
      organizationId,
      workspaceId,
      organization: organizations.find((o) => o.id === organizationId) ?? null,
      workspace: workspaces.find((w) => w.id === workspaceId) ?? null,
      orgsLoading: orgsQuery.isLoading,
      workspacesLoading: workspacesQuery.isLoading,
      setOrganizationId,
      setWorkspaceId,
    };
  }, [
    orgsQuery.data,
    workspacesQuery.data,
    organizationId,
    workspaceId,
    orgsQuery.isLoading,
    workspacesQuery.isLoading,
    setOrganizationId,
    setWorkspaceId,
  ]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspaceContext must be used within WorkspaceProvider');
  return ctx;
}
