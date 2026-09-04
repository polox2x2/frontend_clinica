import { z } from 'zod'

export const specialitySchema = z.object({
  id: z.string().uuid(), createdAt: z.string(), name: z.string(), description: z.string().nullish(),
  parentId: z.string().uuid().nullish(), parentName: z.string().nullish(), isActive: z.boolean(),
})

export const specialityRequestSchema = z.object({
  name: z.string().trim().min(1, 'Ingresa el nombre de la especialidad'),
  description: z.string().trim().transform((value) => value || null),
  parentId: z.union([z.string().uuid(), z.literal(''), z.null()]).transform((value) => value || null),
})
