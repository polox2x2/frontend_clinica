import { useQuery } from '@tanstack/react-query'
import { AlignLeft, Boxes, KeyRound } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { useSession } from '@/features/auth'
import { permissionsClient } from '@/features/permissions/api/permissions-api'
import { permissionKeys, useCreatePermission, useUpdatePermission } from '@/features/permissions/hooks/use-permission-mutations'
import { permissionRequestSchema } from '@/features/permissions/schemas/permission-schemas'
import { AppLoading } from '@/shared/components/feedback/AppLoading'
import { EntityForm } from '@/shared/crud'

export default function PermissionFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { data: session } = useSession()
  const permission = useQuery({ queryKey: [...permissionKeys.all, 'detail', id], queryFn: () => permissionsClient.getById(id), enabled: isEdit })
  const createMutation = useCreatePermission()
  const updateMutation = useUpdatePermission(id)
  const mutation = isEdit ? updateMutation : createMutation

  if (isEdit && permission.isPending) return <AppLoading label="Preparando formulario" />
  if (permission.error) throw permission.error

  const defaultValues = isEdit ? {
    name: permission.data.name,
    groupName: permission.data.groupName ?? '',
    description: permission.data.description ?? '',
  } : { name: '', groupName: '', description: '' }

  const fields = [
    { name: 'name', label: 'Nombre del permiso', placeholder: 'Ej: Appointment:Read', required: true, icon: KeyRound, description: 'Debe respetar la convención Entidad:Acción.' },
    { name: 'groupName', label: 'Grupo', placeholder: 'Ej: Appointment', icon: Boxes, description: 'Se usa para organizar el catálogo visualmente.' },
    { name: 'description', label: 'Descripción', placeholder: 'Describe qué operación habilita este permiso...', type: 'textarea', rows: 4, colSpan: 2, icon: AlignLeft },
  ]

  async function submit(values) {
    await mutation.mutateAsync(values)
    navigate('/dashboard/permisos')
  }

  return <EntityForm key={id ?? 'new'} title={isEdit ? `Editar ${permission.data.name}` : 'Crear permiso'} description="Define una operación autorizable usando la convención Entidad:Acción." icon={KeyRound} fields={fields} schema={permissionRequestSchema} defaultValues={defaultValues} onSubmit={submit} onCancel={() => navigate('/dashboard/permisos')} submitLabel={isEdit ? 'Guardar cambios' : 'Crear permiso'} isSubmitting={mutation.isPending} error={mutation.error} permissionPrefix="Permission" permissions={session.permissions} mode={isEdit ? 'edit' : 'create'} />
}
