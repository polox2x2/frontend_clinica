import { PackagePlus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '@/features/auth'
import { stockEntriesClient } from '@/features/stock-entries/api/stock-entries-api'
import { stockEntryKeys } from '@/features/stock-entries/hooks/use-stock-entry-mutations'
import { EntityDetail } from '@/shared/crud'
const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }); const date = new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeStyle: 'short' })
export default function StockEntryDetailPage() { const { id } = useParams(); const navigate = useNavigate(); const { data: session } = useSession(); const fields = [{ key: 'productName', label: 'Producto' }, { key: 'quantity', label: 'Unidades ingresadas', render: (item) => `+${item.quantity}` }, { key: 'unitCost', label: 'Costo unitario', render: (item) => item.unitCost == null ? 'No registrado' : money.format(item.unitCost) }, { key: 'createdAt', label: 'Fecha y hora', render: (item) => date.format(new Date(item.createdAt)) }, { key: 'note', label: 'Nota', colSpan: 2 }]; return <EntityDetail id={id} queryKey={stockEntryKeys.all} client={stockEntriesClient} title="Detalle de entrada" description="Movimiento histórico que incrementó las existencias." icon={PackagePlus} fields={fields} onBack={() => navigate('/dashboard/entradas')} permissionPrefix="StockEntry" permissions={session.permissions} /> }
