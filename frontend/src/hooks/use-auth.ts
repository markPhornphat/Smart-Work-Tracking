import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import {
  api,
  clearAuthTokens,
  getAccessToken,
  setAuthTokens,
  type AuthUser,
} from '@/lib/api';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

export function useMe() {
  const token = getAccessToken();
  return useQuery({
    queryKey: authKeys.me,
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await api<{ user: AuthUser }>('/api/v1/auth/me');
      return res.user;
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await api<{
        accessToken: string;
        refreshToken: string;
        user: AuthUser;
      }>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
        token: null,
      });
      setAuthTokens(res.accessToken, res.refreshToken);
      return res.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
      void navigate({ to: '/' });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    clearAuthTokens();
    queryClient.clear();
    void navigate({ to: '/login' });
  };
}
