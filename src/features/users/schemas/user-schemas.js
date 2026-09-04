import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()).default([]),
  isActive: z.boolean(),
})

export const userRequestSchema = z.object({
  firstName: z.string().trim().min(1, 'Ingresa el nombre'),
  lastName: z.string().trim().min(1, 'Ingresa el apellido'),
  email: z.string().trim().email('Ingresa un correo válido'),
  password: z.string().default(''),
  roleIds: z.array(z.string().uuid()).default([]),
})

export const createUserSchema = userRequestSchema.extend({
  password: z.string().min(1, 'Ingresa una contraseña'),
})

export const updateUserSchema = userRequestSchema

export const roleSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullish(),
  isActive: z.boolean(),
}).passthrough()
