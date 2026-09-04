import { z } from 'zod'

export const productSchema = z.object({
  id: z.string().uuid(), createdAt: z.string(), name: z.string(), description: z.string().nullish(),
  price: z.coerce.number(), stock: z.number().int(), isActive: z.boolean(),
})

export const productRequestSchema = z.object({
  name: z.string().trim().min(1, 'Ingresa el nombre del producto'),
  description: z.string().trim().transform((value) => value || null),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  stock: z.coerce.number().int('Usa unidades enteras').min(0, 'El stock no puede ser negativo'),
})
