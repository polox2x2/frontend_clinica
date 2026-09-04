import { createCrudClient } from '@/core'
import { specialityRequestSchema, specialitySchema } from '@/features/specialities/schemas/speciality-schemas'

export const specialitiesClient = createCrudClient({ basePath: '/specialities', itemSchema: specialitySchema, requestSchema: specialityRequestSchema })

export async function listSpecialityOptions() {
  return (await specialitiesClient.list({ page: 1, pageSize: 200, sortBy: 'name', sortDirection: 'Ascending' })).items
}
