import { z } from 'zod'

const optionalText = z.string().trim().transform((value) => value || null)
const optionalUuid = z.union([z.string().uuid(), z.literal(''), z.null()]).transform((value) => value || null)

export const menuSchema = z.object({
  id: z.string().uuid(), createdAt: z.string(), label: z.string(), icon: z.string().nullish(),
  route: z.string().nullish(), order: z.number().int().nullish(), requiredPermission: z.string().nullish(),
  parentId: z.string().uuid().nullish(), isActive: z.boolean(),
})

export const menuRequestSchema = z.object({
  label: z.string().trim().min(1, 'Ingresa la etiqueta del menú'),
  icon: optionalText,
  route: optionalText,
  order: z.number().int().min(0, 'El orden no puede ser negativo'),
  requiredPermission: optionalText,
  parentId: optionalUuid,
})
