import { z } from 'zod'

export const menuNodeSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1),
  icon: z.string().nullish(),
  route: z.string().nullish(),
  parentId: z.string().uuid().nullish(),
  order: z.number().int().nullish(),
  children: z.array(z.lazy(() => menuNodeSchema)).default([]),
})

export const menuTreeSchema = z.array(menuNodeSchema)
