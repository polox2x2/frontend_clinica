import { useQuery } from '@tanstack/react-query'
import { CalendarDays, CalendarOff, FileText, Stethoscope } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '@/features/auth'
import { absencesClient } from '@/features/absences/api/absences-api'
import { absenceKeys, useCreateAbsence, useUpdateAbsence } from '@/features/absences/hooks/use-absence-mutations'
import { absenceRequestSchema } from '@/features/absences/schemas/absence-schemas'
import { listAccessibleDoctorOptions } from '@/features/doctors/api/doctors-api'
import { AppLoading } from '@/shared/components/feedback/AppLoading'
import { EntityForm } from '@/shared/crud'
export default function AbsenceFormPage() {
  const { id } = useParams(); const edit = !!id; const navigate = useNavigate(); const { data: session } = useSession()
  const doctors = useQuery({ queryKey: ['doctors', 'absence-options', session.username], queryFn: () => listAccessibleDoctorOptions(session) })
  const item = useQuery({ queryKey: [...absenceKeys.all, 'detail', id], queryFn: () => absencesClient.getById(id), enabled: edit })
  const create = useCreateAbsence(); const update = useUpdateAbsence(id); const mutation = edit ? update : create
  if (doctors.isPending || (edit && item.isPending)) return <AppLoading label="Preparando ausencia" />
  const error = doctors.error ?? item.error; if (error) throw error
  const current = item.data; const values = edit ? { doctorId: current.doctorId, startDate: current.startDate, endDate: current.endDate, reason: current.reason ?? '' } : { doctorId: doctors.data.length === 1 ? doctors.data[0].id : '', startDate: '', endDate: '', reason: '' }
  const fields = [{ name: 'doctorId', label: 'Médico', type: 'select', required: true, icon: Stethoscope, disabled: session.roles.includes('Medico'), options: doctors.data.map(x => ({ value: x.id, label: `${x.firstName} ${x.lastName}` })) }, { name: 'startDate', label: 'Desde', type: 'date', required: true, icon: CalendarDays }, { name: 'endDate', label: 'Hasta', type: 'date', required: true, icon: CalendarDays }, { name: 'reason', label: 'Motivo', type: 'textarea', rows: 4, colSpan: 2, icon: FileText }]
  async function submit(valuesToSave) { await mutation.mutateAsync(valuesToSave); navigate('/dashboard/ausencias') }
  return <EntityForm key={id ?? 'new'} title={edit ? 'Editar ausencia' : 'Registrar ausencia médica'} description="Este rango será omitido al generar nuevas franjas de atención." icon={CalendarOff} fields={fields} schema={absenceRequestSchema} defaultValues={values} onSubmit={submit} onCancel={() => navigate('/dashboard/ausencias')} isSubmitting={mutation.isPending} error={mutation.error} permissionPrefix="Absence" permissions={session.permissions} mode={edit ? 'edit' : 'create'} />
}
