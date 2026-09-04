import { useState } from 'react'
import { Boxes, Eye, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useSession } from '@/features/auth'
import { productsClient } from '@/features/products/api/products-api'
import { productKeys, useDeleteProduct } from '@/features/products/hooks/use-product-mutations'
import { EntityList } from '@/shared/crud'

const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
export default function ProductsListPage() {
  const navigate = useNavigate(); const { data: session } = useSession(); const remove = useDeleteProduct(); const [selected, setSelected] = useState(null)
  const columns = [
    { key: 'name', label: 'Producto', sortable: true, render: (item) => <span className="font-medium">{item.name}</span> },
    { key: 'price', label: 'Precio', sortable: true, render: (item) => money.format(item.price) },
    { key: 'stock', label: 'Existencias', sortable: true, render: (item) => <Badge variant={item.stock > 5 ? 'secondary' : item.stock > 0 ? 'outline' : 'destructive'}>{item.stock} uds.</Badge> },
    { key: 'description', label: 'Descripción' },
  ]
  const actions = [
    { action: 'Read', label: 'Ver detalle', icon: Eye, onClick: (item) => navigate(`/dashboard/productos/${item.id}`) },
    { action: 'Update', label: 'Editar', icon: Pencil, onClick: (item) => navigate(`/dashboard/productos/${item.id}/editar`) },
    { action: 'Delete', label: 'Desactivar', icon: Trash2, variant: 'destructive', onClick: setSelected },
  ]
  async function confirmDelete() { try { await remove.mutateAsync(selected.id); setSelected(null) } catch { /* mantiene el dialogo */ } }
  return <><EntityList title="Productos" description="Catálogo, precios y existencias disponibles en farmacia." icon={Boxes} queryKey={productKeys.all} client={productsClient} columns={columns} defaultSortBy="name" searchPlaceholder="Buscar por nombre o descripción..." createLabel="Crear producto" onCreate={() => navigate('/dashboard/productos/nuevo')} actions={actions} permissionPrefix="Product" permissions={session.permissions} /><AlertDialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogMedia><Trash2 /></AlertDialogMedia><AlertDialogTitle>¿Desactivar {selected?.name}?</AlertDialogTitle><AlertDialogDescription>Ya no estará disponible para nuevas entradas o ventas.{remove.error && <span className="mt-2 block text-destructive">{remove.error.message}</span>}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={remove.isPending}>Cancelar</AlertDialogCancel><AlertDialogAction variant="destructive" disabled={remove.isPending} onClick={confirmDelete}>{remove.isPending ? 'Desactivando...' : 'Desactivar'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></>
}
