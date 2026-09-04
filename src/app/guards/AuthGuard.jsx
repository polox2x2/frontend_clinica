import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useSession } from '@/features/auth'
import { AppLoading } from '@/shared/components/feedback/AppLoading'

export function AuthGuard() {
  const location = useLocation()
  const { data: session, isPending } = useSession()

  if (isPending) return <AppLoading label="Restaurando sesión" />
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return <Outlet />
}
