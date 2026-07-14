import { QueryClient } from '@tanstack/react-query';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { Toaster } from 'sonner';

import { AppShell } from '@/components/app-shell';
import { getAccessToken } from '@/lib/api';
import { persistence } from '@/lib/persistence';
import { LoginPage } from '@/pages/login-page';
import { ProjectsPage } from '@/pages/projects-page';
import { WorkTrackingPage } from '@/pages/work-tracking-page';

export type RouterContext = {
  queryClient: QueryClient;
};

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" closeButton />
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (getAccessToken()) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_app',
  beforeLoad: () => {
    if (!getAccessToken()) {
      throw redirect({ to: '/login' });
    }
  },
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  beforeLoad: () => {
    const lastProjectId = persistence.getProjectId();
    if (lastProjectId) {
      throw redirect({
        to: '/projects/$projectId',
        params: { projectId: lastProjectId },
      });
    }
    throw redirect({ to: '/projects' });
  },
});

const projectsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/projects',
  component: ProjectsPage,
});

const projectDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/projects/$projectId',
  component: WorkTrackingPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  appRoute.addChildren([indexRoute, projectsRoute, projectDetailRoute]),
]);

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter;
  }
}
