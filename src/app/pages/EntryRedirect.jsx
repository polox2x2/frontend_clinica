import { Navigate } from 'react-router-dom'

import { useSession } from '@/features/auth'
import { AppLoading } from '@/shared/components/feedback/AppLoading'

export function EntryRedirect() {
  const { data: session, isPending } = useSession()

  if (isPending) return <AppLoading label="Comprobando sesión" />
  return <Navigate to={session ? '/dashboard' : '/login'} replace />
}
