import { createCrudClient, httpClient } from '@/core'
import { doctorRequestSchema, doctorSchema } from '@/features/doctors/schemas/doctor-schemas'
import { specialitiesClient } from '@/features/specialities/api/specialities-api'
export const doctorsClient=createCrudClient({basePath:'/doctors',itemSchema:doctorSchema,requestSchema:doctorRequestSchema})
export async function listSpecialities(){return (await specialitiesClient.list({page:1,pageSize:200,sortBy:'name',sortDirection:'Ascending'})).items}
export async function listDoctorOptions(){return (await doctorsClient.list({page:1,pageSize:200,sortBy:'user.firstName',sortDirection:'Ascending'})).items}
export async function getMyDoctor(){const{data}=await httpClient.get('/doctors/me');return doctorSchema.parse(data)}
export async function listAccessibleDoctorOptions(session){return session.roles.includes('Medico')?[await getMyDoctor()]:listDoctorOptions()}
