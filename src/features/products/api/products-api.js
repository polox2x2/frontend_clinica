import { createCrudClient } from '@/core'
import { productRequestSchema, productSchema } from '@/features/products/schemas/product-schemas'

export const productsClient = createCrudClient({ basePath: '/products', itemSchema: productSchema, requestSchema: productRequestSchema })

export async function listProductOptions() {
  return (await productsClient.list({ page: 1, pageSize: 200, sortBy: 'name', sortDirection: 'Ascending' })).items
}
