import { useQuery } from '@tanstack/react-query'
import { AlignLeft, KeyRound, ShieldCheck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { useSession } from '@/features/auth'
import { listPermissions, rolesClient } from '@/features/roles/api/roles-api'
import { PermissionSelector } from '@/features/roles/components/PermissionSelector'
import { roleKeys, useCreateRole, useUpdateRole } from '@/features/roles/hooks/use-role-mutations'
import { roleRequestSchema } from '@/features/roles/schemas/role-schemas'
import { AppLoading } from '@/shared/components/feedback/AppLoading'
import { EntityForm } from '@/shared/crud'

export default function RoleFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { data: session } = useSession()
  const permissions = useQuery({ queryKey: ['permissions', 'options'], queryFn: listPermissions, staleTime: 5 * 60_000 })
  const role = useQuery({ queryKey: [...roleKeys.all, 'detail', id], queryFn: () => rolesClient.getById(id), enabled: isEdit })
  const createMutation = useCreateRole()
  const updateMutation = useUpdateRole(id)
  const mutation = isEdit ? updateMutation : createMutation

  if (permissions.isPending || (isEdit && role.isPending)) return <AppLoading label="Preparando formulario" />
  const loadError = permissions.error ?? role.error
  if (loadError) throw loadError

  const defaultValues = isEdit ? {
    name: role.data.name,
    description: role.data.description ?? '',
    permissionIds: role.data.permissions.map((permission) => permission.id),
  } : { name: '', description: '', permissionIds: [] }

  const fields = [
    { name: 'name', label: 'Nombre', placeholder: 'Ej: Recepción', required: true, icon: ShieldCheck },
    { name: 'description', label: 'Descripción', placeholder: 'Describe las responsabilidades de este rol...', type: 'textarea', rows: 3, colSpan: 2, icon: AlignLeft },
    {
      name: 'permissionIds', label: 'Permisos', colSpan: 2, icon: KeyRound,
      description: 'Selecciona las operaciones que podrán realizar los usuarios con este rol.',
      render: ({ value, setValue, disabled }) => <PermissionSelector permissions={permissions.data} value={value} setValue={setValue} disabled={disabled} />,
    },
  ]

  async function submit(values) {
    await mutation.mutateAsync(values)
    navigate('/dashboard/roles')
  }

  return (
    <EntityForm
      key={id ?? 'new'}
      title={isEdit ? `Editar rol ${role.data.name}` : 'Crear rol'}
      description={isEdit ? 'Modifica la descripción o los permisos asignados.' : 'Agrupa permisos para asignarlos fácilmente a los usuarios.'}
      icon={ShieldCheck}
      fields={fields}
      schema={roleRequestSchema}
      defaultValues={defaultValues}
      onSubmit={submit}
      onCancel={() => navigate('/dashboard/roles')}
      submitLabel={isEdit ? 'Guardar cambios' : 'Crear rol'}
      isSubmitting={mutation.isPending}
      error={mutation.error}
      permissionPrefix="Role"
      permissions={session.permissions}
      mode={isEdit ? 'edit' : 'create'}
    />
  )
}
