export const TOKEN_KEY = 'swt_access';
export const REFRESH_KEY = 'swt_refresh';
export const ORG_KEY = 'swt_org_id';
export const WORKSPACE_KEY = 'swt_workspace_id';
export const PROJECT_KEY = 'swt_project_id';
export const SIDEBAR_COLLAPSED_KEY = 'swt_sidebar_collapsed';

export async function api<T>(
  url: string,
  init?: RequestInit & { token?: string | null },
): Promise<T> {
  const { token: tokenOverride, headers: initHeaders, ...rest } = init ?? {};
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    ...(initHeaders as Record<string, string>),
  };
  const token =
    init && 'token' in init ? tokenOverride : localStorage.getItem(TOKEN_KEY);
  if (token) headers.authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...rest, headers });
  const body = (await res.json().catch(() => ({}))) as {
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(body?.error?.message ?? `Request failed (${res.status})`);
  }
  return body as T;
}

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
};

export type Workspace = {
  id: string;
  name: string;
  slug?: string;
  organizationId: string;
};

export type Project = {
  id: string;
  name: string;
  key: string;
  workspaceId: string;
  description: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  templateId?: string | null;
  lastViewType?: string;
};

export type ProjectTemplate = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  department: string | null;
};

export type Task = {
  id: string;
  title: string;
  statusId: string | null;
  priority: string;
  taskNumber?: number;
};

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function setAuthTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}
