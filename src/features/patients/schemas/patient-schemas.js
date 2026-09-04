import { z } from 'zod'

export const patientSchema = z.object({
  id: z.string().uuid(), createdAt: z.string(), documentId: z.string(), dateOfBirth: z.string().nullish(),
  phone: z.string().nullish(), firstName: z.string(), lastName: z.string(), username: z.string(),
  email: z.string().email(), userId: z.string().uuid(), isActive: z.boolean(),
})

const profileFields = {
  documentId: z.string().trim().min(1, 'Ingresa el documento de identidad'),
  dateOfBirth: z.union([z.string(), z.null()]).transform((value) => value || null),
  phone: z.string().trim().transform((value) => value || null),
}

export const selfPatientRequestSchema = z.object(profileFields)
export const patientRequestSchema = z.object({
  firstName: z.string().trim().min(1, 'Ingresa el nombre'),
  lastName: z.string().trim().min(1, 'Ingresa los apellidos'),
  email: z.string().trim().email('Ingresa un correo válido'),
  password: z.string().default(''),
  ...profileFields,
})
export const createPatientSchema = patientRequestSchema.extend({ password: z.string().min(1, 'Ingresa una contraseña inicial') })
