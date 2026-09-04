import { useQuery } from '@tanstack/react-query'
import { AtSign, KeyRound, ShieldCheck, UserRound, Users } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { AppLoading } from '@/shared/components/feedback/AppLoading'
import { EntityForm } from '@/shared/crud'
import { listRoles, usersClient } from '@/features/users/api/users-api'
import { RoleSelector } from '@/features/users/components/RoleSelector'
import { useCreateUser, useUpdateUser, userKeys } from '@/features/users/hooks/use-user-mutations'
import { createUserSchema, updateUserSchema } from '@/features/users/schemas/user-schemas'
import { useSession } from '@/features/auth'

export default function UserFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { data: session } = useSession()
  const roles = useQuery({ queryKey: ['roles', 'options'], queryFn: listRoles, staleTime: 5 * 60_000 })
  const user = useQuery({ queryKey: [...userKeys.all, 'detail', id], queryFn: () => usersClient.getById(id), enabled: isEdit })
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser(id)
  const mutation = isEdit ? updateMutation : createMutation

  if (roles.isPending || (isEdit && user.isPending)) return <AppLoading label="Preparando formulario" />
  const loadError = roles.error ?? user.error
  if (loadError) throw loadError

  const selectedRoleIds = isEdit
    ? roles.data.filter((role) => user.data.roles.includes(role.name)).map((role) => role.id)
    : []
  const defaultValues = isEdit ? {
    firstName: user.data.firstName,
    lastName: user.data.lastName,
    email: user.data.email,
    password: '',
    roleIds: selectedRoleIds,
  } : { firstName: '', lastName: '', email: '', password: '', roleIds: [] }

  const fields = [
    { name: 'firstName', label: 'Nombre', placeholder: 'Ej: María', required: true, icon: UserRound, autoComplete: 'given-name' },
    { name: 'lastName', label: 'Apellidos', placeholder: 'Ej: Pérez Gómez', required: true, icon: UserRound, autoComplete: 'family-name' },
    { name: 'email', label: 'Correo electrónico', placeholder: 'usuario@clinica.com', type: 'email', required: true, icon: AtSign, autoComplete: 'email' },
    { name: 'password', label: isEdit ? 'Nueva contraseña' : 'Contraseña', placeholder: isEdit ? 'Déjala vacía para conservarla' : 'Ingresa una contraseña', type: 'password', required: !isEdit, icon: KeyRound, autoComplete: 'new-password' },
    {
      name: 'roleIds', label: 'Roles del usuario', colSpan: 2, icon: ShieldCheck,
      description: 'Los permisos efectivos serán la combinación de los roles seleccionados.',
      render: ({ value, setValue, disabled }) => <RoleSelector roles={roles.data} value={value} setValue={setValue} disabled={disabled} />,
    },
  ]

  async function submit(values) {
    await mutation.mutateAsync(values)
    navigate('/dashboard/usuarios')
  }

  return (
    <EntityForm
      key={id ?? 'new'}
      title={isEdit ? `Editar ${user.data.username}` : 'Crear usuario'}
      description={isEdit ? 'Actualiza sus datos personales, credenciales o roles.' : 'El nombre de usuario será generado automáticamente por el sistema.'}
      icon={Users}
      fields={fields}
      schema={isEdit ? updateUserSchema : createUserSchema}
      defaultValues={defaultValues}
      onSubmit={submit}
      onCancel={() => navigate('/dashboard/usuarios')}
      submitLabel={isEdit ? 'Guardar cambios' : 'Crear usuario'}
      isSubmitting={mutation.isPending}
      error={mutation.error}
      permissionPrefix="User"
      permissions={session.permissions}
      mode={isEdit ? 'edit' : 'create'}
    />
  )
}
