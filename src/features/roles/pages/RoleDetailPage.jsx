import { Badge } from '@/components/ui/badge'
import { ShieldCheck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { useSession } from '@/features/auth'
import { rolesClient } from '@/features/roles/api/roles-api'
import { roleKeys } from '@/features/roles/hooks/use-role-mutations'
import { EntityDetail } from '@/shared/crud'

export default function RoleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: session } = useSession()
  const fields = [
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    {
      key: 'permissions', label: 'Permisos asignados', colSpan: 2,
      render: (role) => role.permissions.length
        ? <div className="flex flex-wrap gap-2">{role.permissions.map((permission) => <Badge key={permission.id} variant="secondary">{permission.name}</Badge>)}</div>
        : <span className="text-muted-foreground">Sin permisos</span>,
    },
    { key: 'createdAt', label: 'Fecha de creación', render: (role) => new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(role.createdAt)) },
  ]

  return <EntityDetail id={id} queryKey={roleKeys.all} client={rolesClient} title="Detalle del rol" description="Información y permisos efectivos del rol." icon={ShieldCheck} fields={fields} onBack={() => navigate('/dashboard/roles')} onEdit={(role) => navigate(`/dashboard/roles/${role.id}/editar`)} permissionPrefix="Role" permissions={session.permissions} />
}
