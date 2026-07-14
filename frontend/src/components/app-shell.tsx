import { Outlet, useRouterState } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { useState } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { WorkspaceProvider } from '@/hooks/use-workspace-context';
import { persistence } from '@/lib/persistence';

export function AppShell() {
  const [collapsed, setCollapsed] = useState(() => persistence.getSidebarCollapsed());
  const [mobileOpen, setMobileOpen] = useState(false);
  const matches = useRouterState({ select: (s) => s.matches });
  const projectMatch = matches.find(
    (m) => m.routeId === '/_app/projects/$projectId',
  );
  const activeProjectId =
    projectMatch && 'projectId' in projectMatch.params
      ? String(projectMatch.params.projectId)
      : null;

  function onCollapsedChange(next: boolean) {
    setCollapsed(next);
    persistence.setSidebarCollapsed(next);
  }

  return (
    <WorkspaceProvider>
      <div className="flex min-h-svh bg-background">
        <div className="hidden md:block">
          <AppSidebar
            collapsed={collapsed}
            onCollapsedChange={onCollapsedChange}
            activeProjectId={activeProjectId}
          />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <AppSidebar
              collapsed={false}
              onCollapsedChange={() => undefined}
              activeProjectId={activeProjectId}
              className="h-full w-full border-0"
            />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-20 flex items-center gap-2 border-b bg-background/90 px-4 py-2 backdrop-blur md:hidden">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu />
            </Button>
            <span className="font-display text-sm font-bold">Smart-Work-Tracking</span>
          </div>
          <Outlet />
        </div>
      </div>
    </WorkspaceProvider>
  );
}
