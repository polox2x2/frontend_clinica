import { useState } from 'react'
import { Eye, Pencil, Trash2, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useSession } from '@/features/auth'
import { usersClient } from '@/features/users/api/users-api'
import { useDeleteUser, userKeys } from '@/features/users/hooks/use-user-mutations'
import { EntityList } from '@/shared/crud'

export default function UsersListPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const remove = useDeleteUser()
  const [selectedUser, setSelectedUser] = useState(null)

  const columns = [
    { key: 'username', label: 'Usuario', sortable: true, render: (user) => <span className="font-medium">{user.username}</span> },
    { key: 'firstName', label: 'Nombre', sortable: true, render: (user) => `${user.firstName} ${user.lastName}` },
    { key: 'email', label: 'Correo', sortable: true },
    { key: 'roles', label: 'Roles', render: (user) => <div className="flex flex-wrap gap-1">{user.roles.length ? user.roles.map((role) => <Badge key={role} variant="secondary">{role}</Badge>) : <span className="text-muted-foreground">Sin roles</span>}</div> },
  ]
  const actions = [
    { action: 'Read', label: 'Ver detalle', icon: Eye, onClick: (user) => navigate(`/dashboard/usuarios/${user.id}`) },
    { action: 'Update', label: 'Editar', icon: Pencil, onClick: (user) => navigate(`/dashboard/usuarios/${user.id}/editar`) },
    { action: 'Delete', label: 'Eliminar', icon: Trash2, variant: 'destructive', disabled: (user) => user.id === session.id, onClick: setSelectedUser },
  ]

  async function confirmDelete() {
    try {
      await remove.mutateAsync(selectedUser.id)
      setSelectedUser(null)
    } catch {
      // El dialogo permanece abierto para que el usuario pueda reintentar o cancelar.
    }
  }

  return (
    <>
      <EntityList
        title="Usuarios"
        description="Administra las cuentas del sistema y sus roles."
        icon={Users}
        queryKey={userKeys.all}
        client={usersClient}
        columns={columns}
        defaultSortBy="username"
        searchPlaceholder="Buscar por usuario o correo..."
        createLabel="Crear usuario"
        onCreate={() => navigate('/dashboard/usuarios/nuevo')}
        actions={actions}
        permissionPrefix="User"
        permissions={session.permissions}
      />

      <AlertDialog open={Boolean(selectedUser)} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia><Trash2 /></AlertDialogMedia>
            <AlertDialogTitle>¿Desactivar este usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.username} dejará de aparecer en los listados y no podrá iniciar sesión. Esta acción realiza un borrado lógico.
              {remove.error && <span className="mt-2 block text-destructive">{remove.error.message}</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={remove.isPending} onClick={confirmDelete}>
              {remove.isPending ? 'Desactivando...' : 'Desactivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
