import {
  ORG_KEY,
  PROJECT_KEY,
  SIDEBAR_COLLAPSED_KEY,
  WORKSPACE_KEY,
} from '@/lib/api';

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* ignore quota / private mode */
  }
}

export const persistence = {
  getOrgId: () => read(ORG_KEY),
  setOrgId: (id: string | null) => write(ORG_KEY, id),
  getWorkspaceId: () => read(WORKSPACE_KEY),
  setWorkspaceId: (id: string | null) => write(WORKSPACE_KEY, id),
  getProjectId: () => read(PROJECT_KEY),
  setProjectId: (id: string | null) => write(PROJECT_KEY, id),
  getSidebarCollapsed: () => read(SIDEBAR_COLLAPSED_KEY) === '1',
  setSidebarCollapsed: (collapsed: boolean) => write(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0'),
};
