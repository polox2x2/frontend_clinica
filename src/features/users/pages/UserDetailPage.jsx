import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { useSession } from '@/features/auth'
import { usersClient } from '@/features/users/api/users-api'
import { userKeys } from '@/features/users/hooks/use-user-mutations'
import { EntityDetail } from '@/shared/crud'

export default function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: session } = useSession()
  const fields = [
    { key: 'username', label: 'Usuario' },
    { key: 'email', label: 'Correo electrónico' },
    { key: 'firstName', label: 'Nombre' },
    { key: 'lastName', label: 'Apellidos' },
    { key: 'roles', label: 'Roles', colSpan: 2, render: (user) => <div className="flex flex-wrap gap-2">{user.roles.length ? user.roles.map((role) => <Badge key={role} variant="secondary">{role}</Badge>) : 'Sin roles'}</div> },
    { key: 'createdAt', label: 'Fecha de creación', render: (user) => new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(user.createdAt)) },
  ]

  return <EntityDetail id={id} queryKey={userKeys.all} client={usersClient} title="Detalle del usuario" description="Información de cuenta y roles asignados." icon={Users} fields={fields} onBack={() => navigate('/dashboard/usuarios')} onEdit={(user) => navigate(`/dashboard/usuarios/${user.id}/editar`)} permissionPrefix="User" permissions={session.permissions} />
}
