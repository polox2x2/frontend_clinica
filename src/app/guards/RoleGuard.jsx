import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '@/features/auth'
import { hasRole } from '@/shared/security/authorization'

export function RoleGuard({ role }) {
  const { data: session } = useSession()
  return hasRole(session, role) ? <Outlet /> : <Navigate to="/sin-acceso" replace />
}
