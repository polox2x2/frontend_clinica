import { z } from 'zod'

import { httpClient } from '@/core/api/http-client'

export const pagedResponseSchema = (itemSchema) => z.object({
  items: z.array(itemSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalCount: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  empty: z.boolean().optional(),
  isEmpty: z.boolean().optional(),
}).transform((page) => ({
  ...page,
  isEmpty: page.isEmpty ?? page.empty ?? page.items.length === 0,
}))

export function createCrudClient({ basePath, itemSchema, requestSchema }) {
  const pageSchema = pagedResponseSchema(itemSchema)

  return Object.freeze({
    async list(params = {}) {
      const { data } = await httpClient.get(basePath, { params })
      return pageSchema.parse(data)
    },
    async getById(id) {
      const { data } = await httpClient.get(`${basePath}/${id}`)
      return itemSchema.parse(data)
    },
    async create(values) {
      const body = requestSchema.parse(values)
      const { data } = await httpClient.post(basePath, body)
      return itemSchema.parse(data)
    },
    async update(id, values) {
      const body = requestSchema.parse(values)
      const { data } = await httpClient.put(`${basePath}/${id}`, body)
      return itemSchema.parse(data)
    },
    async remove(id) {
      await httpClient.delete(`${basePath}/${id}`)
    },
  })
}
