import { Badge } from '@/components/ui/badge'
import { Menu } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '@/features/auth'
import { menusClient } from '@/features/menus/api/menus-api'
import { menuCrudKeys } from '@/features/menus/hooks/use-menu-mutations'
import { EntityDetail } from '@/shared/crud'
import { MenuIcon } from '@/shared/navigation/menu-icons'

export default function MenuDetailPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { data: session } = useSession()
  const fields = [
    { key: 'label', label: 'Etiqueta' },
    { key: 'icon', label: 'Icono', render: (item) => item.icon ? <span className="flex items-center gap-2"><MenuIcon name={item.icon} /> {item.icon}</span> : '—' },
    { key: 'route', label: 'Ruta' },
    { key: 'order', label: 'Orden' },
    { key: 'requiredPermission', label: 'Permiso requerido', render: (item) => item.requiredPermission ? <Badge variant="secondary">{item.requiredPermission}</Badge> : 'Cualquier usuario autenticado' },
    { key: 'parentId', label: 'ID del padre' },
  ]
  return <EntityDetail id={id} queryKey={menuCrudKeys.all} client={menusClient} title="Detalle del menú" description="Configuración de este nodo de navegación." icon={Menu} fields={fields} onBack={() => navigate('/dashboard/menus')} onEdit={(item) => navigate(`/dashboard/menus/${item.id}/editar`)} permissionPrefix="Menu" permissions={session.permissions} />
}
