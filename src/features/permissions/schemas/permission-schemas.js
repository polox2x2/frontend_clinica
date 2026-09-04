import { z } from 'zod'

export const permissionSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  name: z.string(),
  groupName: z.string().nullish(),
  description: z.string().nullish(),
  isActive: z.boolean(),
})

export const permissionRequestSchema = z.object({
  name: z.string().trim().min(1, 'Ingresa el nombre del permiso').refine(
    (name) => /^[^:]+:[^:]+$/.test(name),
    'Usa el formato Entidad:Acción, por ejemplo Patient:Read',
  ),
  groupName: z.string().trim().default(''),
  description: z.string().trim().default(''),
})
