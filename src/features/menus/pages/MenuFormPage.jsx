import { useQuery } from '@tanstack/react-query'
import { Hash, KeyRound, Link2, ListTree, Menu, Smile } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '@/features/auth'
import { listMenuOptions, listPermissionOptions, menusClient } from '@/features/menus/api/menus-api'
import { menuCrudKeys, useCreateMenu, useUpdateMenu } from '@/features/menus/hooks/use-menu-mutations'
import { menuRequestSchema } from '@/features/menus/schemas/menu-schemas'
import { AppLoading } from '@/shared/components/feedback/AppLoading'
import { EntityForm } from '@/shared/crud'

const ICONS = ['activity', 'calendar', 'calendar-check', 'calendar-days', 'calendar-off', 'clock', 'file-text', 'key', 'menu', 'package', 'package-plus', 'pill', 'shield', 'shopping-cart', 'stethoscope', 'user-round', 'users']

export default function MenuFormPage() {
  const { id } = useParams(); const isEdit = Boolean(id); const navigate = useNavigate(); const { data: session } = useSession()
  const menuOptions = useQuery({ queryKey: [...menuCrudKeys.all, 'options'], queryFn: listMenuOptions })
  const permissionOptions = useQuery({ queryKey: ['permissions', 'menu-options'], queryFn: listPermissionOptions })
  const menu = useQuery({ queryKey: [...menuCrudKeys.all, 'detail', id], queryFn: () => menusClient.getById(id), enabled: isEdit })
  const createMutation = useCreateMenu(); const updateMutation = useUpdateMenu(id); const mutation = isEdit ? updateMutation : createMutation
  if (menuOptions.isPending || permissionOptions.isPending || (isEdit && menu.isPending)) return <AppLoading label="Preparando formulario" />
  const loadError = menuOptions.error ?? permissionOptions.error ?? menu.error; if (loadError) throw loadError
  const current = menu.data
  const values = isEdit ? { label: current.label, icon: current.icon ?? '', route: current.route ?? '', order: current.order ?? 0, requiredPermission: current.requiredPermission ?? '', parentId: current.parentId ?? '' } : { label: '', icon: '', route: '', order: 0, requiredPermission: '', parentId: '' }
  const fields = [
    { name: 'label', label: 'Etiqueta', placeholder: 'Ej: Usuarios', required: true, icon: Menu },
    { name: 'order', label: 'Orden', type: 'number', required: true, icon: Hash },
    { name: 'icon', label: 'Icono', type: 'select', placeholder: 'Seleccionar icono', icon: Smile, options: ICONS.map((name) => ({ value: name, label: name })) },
    { name: 'route', label: 'Ruta', placeholder: 'Ej: /dashboard/usuarios', icon: Link2 },
    { name: 'parentId', label: 'Menú padre', type: 'select', placeholder: 'Sin padre (sección raíz)', icon: ListTree, options: menuOptions.data.filter((option) => option.id !== id && !option.parentId).map((option) => ({ value: option.id, label: option.label })) },
    { name: 'requiredPermission', label: 'Permiso requerido', type: 'select', placeholder: 'Visible para cualquier usuario autenticado', icon: KeyRound, options: permissionOptions.data.map((permission) => ({ value: permission.name, label: permission.name })) },
  ]
  async function submit(data) { await mutation.mutateAsync(data); navigate('/dashboard/menus') }
  return <EntityForm key={id ?? 'new'} title={isEdit ? `Editar ${current.label}` : 'Crear elemento de menú'} description="Configura la navegación dinámica y el permiso que controla su visibilidad." icon={Menu} fields={fields} schema={menuRequestSchema} defaultValues={values} onSubmit={submit} onCancel={() => navigate('/dashboard/menus')} submitLabel={isEdit ? 'Guardar cambios' : 'Crear menú'} isSubmitting={mutation.isPending} error={mutation.error} permissionPrefix="Menu" permissions={session.permissions} mode={isEdit ? 'edit' : 'create'} />
}
