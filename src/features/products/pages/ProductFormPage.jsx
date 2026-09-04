import { useQuery } from '@tanstack/react-query'
import { AlignLeft, Boxes, CircleDollarSign, Package } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '@/features/auth'
import { productsClient } from '@/features/products/api/products-api'
import { productKeys, useCreateProduct, useUpdateProduct } from '@/features/products/hooks/use-product-mutations'
import { productRequestSchema } from '@/features/products/schemas/product-schemas'
import { AppLoading } from '@/shared/components/feedback/AppLoading'
import { EntityForm } from '@/shared/crud'

export default function ProductFormPage() {
  const { id } = useParams(); const edit = Boolean(id); const navigate = useNavigate(); const { data: session } = useSession()
  const item = useQuery({ queryKey: [...productKeys.all, 'detail', id], queryFn: () => productsClient.getById(id), enabled: edit })
  const create = useCreateProduct(); const update = useUpdateProduct(id); const mutation = edit ? update : create
  if (edit && item.isPending) return <AppLoading label="Preparando producto" />
  if (item.error) throw item.error
  const product = item.data; const values = edit ? { name: product.name, description: product.description ?? '', price: product.price, stock: product.stock } : { name: '', description: '', price: 0, stock: 0 }
  const fields = [{ name: 'name', label: 'Nombre', required: true, icon: Boxes, placeholder: 'Ej: Paracetamol 500 mg' }, { name: 'price', label: 'Precio de venta', type: 'number', required: true, icon: CircleDollarSign, description: 'Monto en soles.' }, { name: 'stock', label: 'Stock', type: 'number', required: true, icon: Package, description: edit ? 'Para ingresos posteriores usa Entradas de stock.' : 'Existencias iniciales del producto.' }, { name: 'description', label: 'Descripción', type: 'textarea', rows: 4, colSpan: 2, icon: AlignLeft }]
  async function submit(valuesToSave) { await mutation.mutateAsync(valuesToSave); navigate('/dashboard/productos') }
  return <EntityForm key={id ?? 'new'} title={edit ? `Editar ${product.name}` : 'Crear producto'} description="Configura la información comercial y las existencias del producto." icon={Boxes} fields={fields} schema={productRequestSchema} defaultValues={values} onSubmit={submit} onCancel={() => navigate('/dashboard/productos')} submitLabel={edit ? 'Guardar cambios' : 'Crear producto'} isSubmitting={mutation.isPending} error={mutation.error} permissionPrefix="Product" permissions={session.permissions} mode={edit ? 'edit' : 'create'} />
}
