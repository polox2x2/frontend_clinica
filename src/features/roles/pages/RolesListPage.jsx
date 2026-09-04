import { useState } from 'react'
import { Eye, Pencil, ShieldCheck, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useSession } from '@/features/auth'
import { rolesClient } from '@/features/roles/api/roles-api'
import { roleKeys, useDeleteRole } from '@/features/roles/hooks/use-role-mutations'
import { EntityList } from '@/shared/crud'

export default function RolesListPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const remove = useDeleteRole()
  const [selectedRole, setSelectedRole] = useState(null)

  const columns = [
    { key: 'name', label: 'Nombre', sortable: true, render: (role) => <span className="font-medium">{role.name}</span> },
    { key: 'description', label: 'Descripción', sortable: true },
    { key: 'permissions', label: 'Permisos', render: (role) => <Badge variant="secondary">{role.permissions.length}</Badge> },
  ]
  const actions = [
    { action: 'Read', label: 'Ver detalle', icon: Eye, onClick: (role) => navigate(`/dashboard/roles/${role.id}`) },
    { action: 'Update', label: 'Editar', icon: Pencil, onClick: (role) => navigate(`/dashboard/roles/${role.id}/editar`) },
    { action: 'Delete', label: 'Eliminar', icon: Trash2, variant: 'destructive', disabled: (role) => session.roles.includes(role.name), onClick: setSelectedRole },
  ]

  async function confirmDelete() {
    try {
      await remove.mutateAsync(selectedRole.id)
      setSelectedRole(null)
    } catch {
      // Conserva el dialogo abierto para mostrar el error y permitir reintentar.
    }
  }

  return (
    <>
      <EntityList title="Roles" description="Configura grupos de permisos para los usuarios del sistema." icon={ShieldCheck} queryKey={roleKeys.all} client={rolesClient} columns={columns} defaultSortBy="name" searchPlaceholder="Buscar por nombre..." createLabel="Crear rol" onCreate={() => navigate('/dashboard/roles/nuevo')} actions={actions} permissionPrefix="Role" permissions={session.permissions} />
      <AlertDialog open={Boolean(selectedRole)} onOpenChange={(open) => !open && setSelectedRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia><Trash2 /></AlertDialogMedia>
            <AlertDialogTitle>¿Desactivar este rol?</AlertDialogTitle>
            <AlertDialogDescription>
              El rol {selectedRole?.name} dejará de estar disponible para nuevas asignaciones. Esta acción realiza un borrado lógico.
              {remove.error && <span className="mt-2 block text-destructive">{remove.error.message}</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={remove.isPending} onClick={confirmDelete}>{remove.isPending ? 'Desactivando...' : 'Desactivar'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
