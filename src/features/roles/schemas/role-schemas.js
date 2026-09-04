import { z } from 'zod'

export const permissionSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  name: z.string(),
  groupName: z.string().nullish(),
  description: z.string().nullish(),
  isActive: z.boolean(),
})

export const roleSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  permissions: z.array(permissionSchema).default([]),
  isActive: z.boolean(),
})

export const roleRequestSchema = z.object({
  name: z.string().trim().min(1, 'Ingresa el nombre del rol'),
  description: z.string().trim().default(''),
  permissionIds: z.array(z.string().uuid()).default([]),
})
