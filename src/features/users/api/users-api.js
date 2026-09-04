import { createCrudClient, pagedResponseSchema } from '@/core'
import { httpClient } from '@/core/api/http-client'
import { roleSummarySchema, userRequestSchema, userSchema } from '@/features/users/schemas/user-schemas'

export const usersClient = createCrudClient({
  basePath: '/users',
  itemSchema: userSchema,
  requestSchema: userRequestSchema,
})

export async function listRoles() {
  const { data } = await httpClient.get('/roles', {
    params: { page: 1, pageSize: 200, sortBy: 'name', sortDirection: 'Ascending' },
  })
  return pagedResponseSchema(roleSummarySchema).parse(data).items
}
