import { Boxes } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { useSession } from '@/features/auth'
import { productsClient } from '@/features/products/api/products-api'
import { productKeys } from '@/features/products/hooks/use-product-mutations'
import { EntityDetail } from '@/shared/crud'
const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
export default function ProductDetailPage() { const { id } = useParams(); const navigate = useNavigate(); const { data: session } = useSession(); const fields = [{ key: 'name', label: 'Producto' }, { key: 'price', label: 'Precio', render: (item) => money.format(item.price) }, { key: 'stock', label: 'Existencias', render: (item) => <Badge variant={item.stock ? 'secondary' : 'destructive'}>{item.stock} unidades</Badge> }, { key: 'description', label: 'Descripción', colSpan: 2 }, { key: 'createdAt', label: 'Fecha de creación', render: (item) => new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(item.createdAt)) }]; return <EntityDetail id={id} queryKey={productKeys.all} client={productsClient} title="Detalle del producto" description="Precio y existencias actuales en farmacia." icon={Boxes} fields={fields} onBack={() => navigate('/dashboard/productos')} onEdit={(item) => navigate(`/dashboard/productos/${item.id}/editar`)} permissionPrefix="Product" permissions={session.permissions} /> }
