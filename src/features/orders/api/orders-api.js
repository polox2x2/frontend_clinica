import { createCrudClient, httpClient } from '@/core'
import { orderRequestSchema, orderSchema } from '@/features/orders/schemas/order-schemas'
export const ordersClient = createCrudClient({ basePath: '/orders', itemSchema: orderSchema, requestSchema: orderRequestSchema })
export async function listPatientOptions() { const { data } = await httpClient.get('/patients', { params: { page: 1, pageSize: 200, sortBy: 'documentId', sortDirection: 'Ascending' } }); return data.items }
