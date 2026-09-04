import { createCrudClient, pagedResponseSchema } from '@/core'
import { httpClient } from '@/core/api/http-client'
import { permissionSchema } from '@/features/permissions/schemas/permission-schemas'
import { menuRequestSchema, menuSchema } from '@/features/menus/schemas/menu-schemas'

export const menusClient = createCrudClient({ basePath: '/menus', itemSchema: menuSchema, requestSchema: menuRequestSchema })

export async function listMenuOptions() {
  return (await menusClient.list({ page: 1, pageSize: 200, sortBy: 'displayOrder', sortDirection: 'Ascending' })).items
}

export async function listPermissionOptions() {
  const { data } = await httpClient.get('/permissions', { params: { page: 1, pageSize: 200, sortBy: 'name', sortDirection: 'Ascending' } })
  return pagedResponseSchema(permissionSchema).parse(data).items
}
