import { useState } from 'react'
import { Eye, KeyRound, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useSession } from '@/features/auth'
import { permissionsClient } from '@/features/permissions/api/permissions-api'
import { permissionKeys, useDeletePermission } from '@/features/permissions/hooks/use-permission-mutations'
import { EntityList } from '@/shared/crud'

export default function PermissionsListPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const remove = useDeletePermission()
  const [selectedPermission, setSelectedPermission] = useState(null)

  const columns = [
    { key: 'name', label: 'Permiso', sortable: true, render: (permission) => <span className="font-mono text-sm font-medium">{permission.name}</span> },
    { key: 'groupName', label: 'Grupo', sortable: true, render: (permission) => permission.groupName ? <Badge variant="secondary">{permission.groupName}</Badge> : null },
    { key: 'description', label: 'Descripción', sortable: true },
  ]
  const actions = [
    { action: 'Read', label: 'Ver detalle', icon: Eye, onClick: (permission) => navigate(`/dashboard/permisos/${permission.id}`) },
    { action: 'Update', label: 'Editar', icon: Pencil, onClick: (permission) => navigate(`/dashboard/permisos/${permission.id}/editar`) },
    { action: 'Delete', label: 'Eliminar', icon: Trash2, variant: 'destructive', onClick: setSelectedPermission },
  ]

  async function confirmDelete() {
    try {
      await remove.mutateAsync(selectedPermission.id)
      setSelectedPermission(null)
    } catch {
      // Mantiene el dialogo visible para informar el error y permitir reintentar.
    }
  }

  return (
    <>
      <EntityList title="Permisos" description="Administra el catálogo de operaciones disponibles para los roles." icon={KeyRound} queryKey={permissionKeys.all} client={permissionsClient} columns={columns} defaultSortBy="name" searchPlaceholder="Buscar por permiso o grupo..." createLabel="Crear permiso" onCreate={() => navigate('/dashboard/permisos/nuevo')} actions={actions} permissionPrefix="Permission" permissions={session.permissions} />
      <AlertDialog open={Boolean(selectedPermission)} onOpenChange={(open) => !open && setSelectedPermission(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia><Trash2 /></AlertDialogMedia>
            <AlertDialogTitle>¿Desactivar este permiso?</AlertDialogTitle>
            <AlertDialogDescription>
              El permiso {selectedPermission?.name} dejará de aparecer en el catálogo. Verifica primero que ningún rol dependa de él.
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
