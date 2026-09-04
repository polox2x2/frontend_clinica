import { createCrudClient, httpClient } from '@/core'
import { createPatientSchema, patientRequestSchema, patientSchema, selfPatientRequestSchema } from '@/features/patients/schemas/patient-schemas'

export const patientsClient = createCrudClient({ basePath: '/patients', itemSchema: patientSchema, requestSchema: patientRequestSchema })
export async function getMyPatientProfile() { const { data } = await httpClient.get('/patients/me'); return patientSchema.parse(data) }
export async function createMyPatientProfile(values) { const body = selfPatientRequestSchema.parse(values); const { data } = await httpClient.post('/patients/me', body); return patientSchema.parse(data) }
export async function updateMyPatientProfile(values) { const body = selfPatientRequestSchema.parse(values); const { data } = await httpClient.put('/patients/me', body); return patientSchema.parse(data) }
export { createPatientSchema }
