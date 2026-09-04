import { z } from 'zod'

export const sessionSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  roles: z.array(z.string()).default([]),
  permissions: z.array(z.string()).default([]),
})

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Ingresa tu usuario'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'Ingresa tu nombre'),
  lastName: z.string().trim().min(1, 'Ingresa tu apellido'),
  email: z.string().trim().email('Ingresa un correo válido'),
  password: z.string().min(1, 'Ingresa una contraseña'),
})
