import { useState } from 'react'
import { Eye, Menu, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useSession } from '@/features/auth'
import { menusClient } from '@/features/menus/api/menus-api'
import { menuCrudKeys, useDeleteMenu } from '@/features/menus/hooks/use-menu-mutations'
import { EntityList } from '@/shared/crud'
import { MenuIcon } from '@/shared/navigation/menu-icons'

export default function MenusListPage() {
  const navigate = useNavigate(); const { data: session } = useSession(); const remove = useDeleteMenu(); const [selected, setSelected] = useState(null)
  const columns = [
    { key: 'label', label: 'Etiqueta', sortable: true, render: (item) => <span className="flex items-center gap-2 font-medium"><MenuIcon name={item.icon} />{item.label}</span> },
    { key: 'route', label: 'Ruta', sortable: true, render: (item) => item.route ? <span className="font-mono text-xs">{item.route}</span> : <Badge variant="outline">Sección</Badge> },
    { key: 'requiredPermission', label: 'Permiso', render: (item) => item.requiredPermission ? <Badge variant="secondary">{item.requiredPermission}</Badge> : 'Público autenticado' },
    { key: 'order', label: 'Orden', sortable: true, sortKey: 'displayOrder' },
  ]
  const actions = [
    { action: 'Read', label: 'Ver detalle', icon: Eye, onClick: (item) => navigate(`/dashboard/menus/${item.id}`) },
    { action: 'Update', label: 'Editar', icon: Pencil, onClick: (item) => navigate(`/dashboard/menus/${item.id}/editar`) },
    { action: 'Delete', label: 'Eliminar', icon: Trash2, variant: 'destructive', onClick: setSelected },
  ]
  async function confirmDelete() { try { await remove.mutateAsync(selected.id); setSelected(null) } catch { /* conserva el dialogo */ } }
  return <><EntityList title="Menús" description="Configura las secciones y opciones de navegación del portal." icon={Menu} queryKey={menuCrudKeys.all} client={menusClient} columns={columns} defaultSortBy="displayOrder" searchPlaceholder="Buscar por etiqueta o ruta..." createLabel="Crear menú" onCreate={() => navigate('/dashboard/menus/nuevo')} actions={actions} permissionPrefix="Menu" permissions={session.permissions} /><AlertDialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogMedia><Trash2 /></AlertDialogMedia><AlertDialogTitle>¿Desactivar este menú?</AlertDialogTitle><AlertDialogDescription>El elemento {selected?.label} desaparecerá del árbol de navegación. Si es padre, revisa primero sus elementos hijos.{remove.error && <span className="mt-2 block text-destructive">{remove.error.message}</span>}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={remove.isPending}>Cancelar</AlertDialogCancel><AlertDialogAction variant="destructive" disabled={remove.isPending} onClick={confirmDelete}>{remove.isPending ? 'Desactivando...' : 'Desactivar'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></>
}
