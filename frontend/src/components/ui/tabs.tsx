import * as React from 'react';

import { cn } from '@/lib/utils';

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function Tabs({
  value,
  onValueChange,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  value,
  className,
  ...props
}: React.ComponentProps<'button'> & { value: string }) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs');
  const active = ctx.value === value;
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        active ? 'bg-background text-foreground shadow-sm' : 'hover:text-foreground',
        className,
      )}
      onClick={() => ctx.onValueChange(value)}
      {...props}
    />
  );
}

function TabsContent({
  value,
  className,
  ...props
}: React.ComponentProps<'div'> & { value: string }) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsContent must be used within Tabs');
  if (ctx.value !== value) return null;
  return <div className={cn('mt-4', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
