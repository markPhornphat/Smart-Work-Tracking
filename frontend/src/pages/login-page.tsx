import { Loader2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/use-auth';

export function LoginPage() {
  const [email, setEmail] = useState('admin@smartwork.local');
  const [password, setPassword] = useState('Admin123!');
  const login = useLogin();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await login.mutateAsync({ email, password });
    } catch {
      /* mutation error state */
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#d4f0fc_0%,_transparent_55%),linear-gradient(160deg,_#f4fbfe_0%,_#89d6fb_45%,_#02577a_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#02a9f7]/25 blur-3xl motion-safe:animate-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-[#01303f]/30 blur-3xl"
      />

      <div className="relative z-10 grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4 text-center lg:text-left">
          <p className="font-display text-4xl font-bold tracking-tight text-[#01303f] sm:text-5xl lg:text-6xl lg:text-white">
            Smart-Work-Tracking
          </p>
          <h1 className="text-xl font-semibold text-[#01303f] sm:text-2xl lg:text-[#d4f0fc]">
            Sign in to your workspace
          </h1>
          <p className="mx-auto max-w-md text-pretty text-[#02577a] lg:mx-0 lg:text-[#d4f0fc]/85">
            Plan projects, track tasks, and keep delivery moving across your organization.
          </p>
        </div>

        <Card className="border-[#89d6fb] bg-white/95 shadow-xl backdrop-blur motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
          <CardHeader>
            <CardTitle className="text-[#01303f]">Welcome back</CardTitle>
            <CardDescription className="text-[#02577a]">
              Use your organization credentials to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {login.error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {login.error.message}
                </p>
              ) : null}
              <Button type="submit" className="w-full" disabled={login.isPending}>
                {login.isPending ? <Loader2 className="animate-spin" /> : null}
                {login.isPending ? 'Signing in…' : 'Sign in'}
              </Button>
              <p className="text-center text-xs text-[#02577a]">
                Demo: admin@smartwork.local / Admin123!
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
