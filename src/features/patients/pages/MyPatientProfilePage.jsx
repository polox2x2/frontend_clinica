import { useQuery } from '@tanstack/react-query'
import { CalendarDays, Contact, HeartPulse, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getMyPatientProfile } from '@/features/patients/api/patients-api'
import { patientKeys, useSaveMyPatientProfile } from '@/features/patients/hooks/use-patient-mutations'
import { selfPatientRequestSchema } from '@/features/patients/schemas/patient-schemas'
import { AppLoading } from '@/shared/components/feedback/AppLoading'
import { EntityForm } from '@/shared/crud'

export default function MyPatientProfilePage() {
  const navigate = useNavigate()
  const profile = useQuery({ queryKey: patientKeys.me, queryFn: getMyPatientProfile, retry: false })
  const missing = profile.error?.status === 404
  const exists = Boolean(profile.data)
  const mutation = useSaveMyPatientProfile(exists)
  if (profile.isPending) return <AppLoading label="Consultando tu perfil" />
  if (profile.error && !missing) throw profile.error
  const values = exists ? { documentId: profile.data.documentId, dateOfBirth: profile.data.dateOfBirth ?? '', phone: profile.data.phone ?? '' } : { documentId: '', dateOfBirth: '', phone: '' }
  const fields = [{ name: 'documentId', label: 'Documento de identidad', required: true, icon: Contact, description: 'Necesario para identificar tu historia y tus reservas.' }, { name: 'dateOfBirth', label: 'Fecha de nacimiento', type: 'date', icon: CalendarDays }, { name: 'phone', label: 'Teléfono', type: 'tel', icon: Phone, autoComplete: 'tel' }]
  async function submit(data) { await mutation.mutateAsync(data) }
  return <EntityForm key={exists ? profile.data.id : 'new-profile'} title={exists ? `Perfil de ${profile.data.firstName}` : 'Completa tu perfil de paciente'} description={exists ? 'Mantén actualizados tus datos para la atención y tus próximas reservas.' : 'Tu cuenta ya está creada. Completa estos datos para poder reservar citas.'} icon={HeartPulse} fields={fields} schema={selfPatientRequestSchema} defaultValues={values} onSubmit={submit} onCancel={() => navigate('/dashboard')} backLabel="Volver al inicio" submitLabel={exists ? 'Actualizar mi perfil' : 'Completar mi perfil'} isSubmitting={mutation.isPending} error={mutation.error} />
}
