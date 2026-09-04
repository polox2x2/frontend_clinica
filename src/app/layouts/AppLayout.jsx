import { Outlet, ScrollRestoration } from 'react-router-dom'

import { AuthSessionBridge } from '@/features/auth'

export function AppLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <AuthSessionBridge />
      <Outlet />
      <ScrollRestoration />
    </div>
  )
}
