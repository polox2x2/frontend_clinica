import { Navigate, Outlet } from 'react-router-dom'

import { useSession } from '@/features/auth'
import { hasAllPermissions, hasAnyPermission } from '@/shared/security/authorization'

export function PermissionGuard({ all = [], any = [] }) {
  const { data: session } = useSession()
  const allowed = hasAllPermissions(session, all) && (any.length === 0 || hasAnyPermission(session, any))

  return allowed ? <Outlet /> : <Navigate to="/sin-acceso" replace />
}
