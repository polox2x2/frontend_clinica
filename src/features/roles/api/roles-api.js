import { createCrudClient, pagedResponseSchema } from '@/core'
import { httpClient } from '@/core/api/http-client'
import { permissionSchema, roleRequestSchema, roleSchema } from '@/features/roles/schemas/role-schemas'

export const rolesClient = createCrudClient({
  basePath: '/roles',
  itemSchema: roleSchema,
  requestSchema: roleRequestSchema,
})

export async function listPermissions() {
  const { data } = await httpClient.get('/permissions', {
    params: { page: 1, pageSize: 200, sortBy: 'name', sortDirection: 'Ascending' },
  })
  return pagedResponseSchema(permissionSchema).parse(data).items
}
