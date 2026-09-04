import { KeyRound } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { useSession } from '@/features/auth'
import { permissionsClient } from '@/features/permissions/api/permissions-api'
import { permissionKeys } from '@/features/permissions/hooks/use-permission-mutations'
import { EntityDetail } from '@/shared/crud'

export default function PermissionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: session } = useSession()
  const fields = [
    { key: 'name', label: 'Nombre' },
    { key: 'groupName', label: 'Grupo' },
    { key: 'description', label: 'Descripción', colSpan: 2 },
    { key: 'createdAt', label: 'Fecha de creación', render: (permission) => new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(permission.createdAt)) },
  ]

  return <EntityDetail id={id} queryKey={permissionKeys.all} client={permissionsClient} title="Detalle del permiso" description="Información del permiso utilizado por roles y operaciones." icon={KeyRound} fields={fields} onBack={() => navigate('/dashboard/permisos')} onEdit={(permission) => navigate(`/dashboard/permisos/${permission.id}/editar`)} permissionPrefix="Permission" permissions={session.permissions} />
}
