import { Navigate, Outlet } from 'react-router-dom'

import { useSession } from '@/features/auth'
import { AppLoading } from '@/shared/components/feedback/AppLoading'

export function GuestGuard() {
  const { data: session, isPending } = useSession()

  if (isPending) return <AppLoading label="Comprobando sesión" />
  if (session) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
