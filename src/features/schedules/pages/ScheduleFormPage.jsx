import { useQuery } from '@tanstack/react-query'
import { Calendar, CalendarDays, Clock, Stethoscope } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '@/features/auth'
import { listAccessibleDoctorOptions } from '@/features/doctors/api/doctors-api'
import { schedulesClient } from '@/features/schedules/api/schedules-api'
import { scheduleKeys, useCreateSchedule, useUpdateSchedule } from '@/features/schedules/hooks/use-schedule-mutations'
import { scheduleRequestSchema } from '@/features/schedules/schemas/schedule-schemas'
import { AppLoading } from '@/shared/components/feedback/AppLoading'
import { EntityForm } from '@/shared/crud'
export default function ScheduleFormPage() {
  const { id } = useParams(); const edit = !!id; const navigate = useNavigate(); const { data: session } = useSession()
  const doctors = useQuery({ queryKey: ['doctors', 'schedule-options', session.username], queryFn: () => listAccessibleDoctorOptions(session) })
  const item = useQuery({ queryKey: [...scheduleKeys.all, 'detail', id], queryFn: () => schedulesClient.getById(id), enabled: edit })
  const create = useCreateSchedule(); const update = useUpdateSchedule(id); const mutation = edit ? update : create
  if (doctors.isPending || (edit && item.isPending)) return <AppLoading label="Preparando horario" />
  const error = doctors.error ?? item.error; if (error) throw error
  const current = item.data; const values = edit ? { doctorId: current.doctorId, availableDate: current.availableDate, startTime: current.startTime.slice(0, 5), endTime: current.endTime.slice(0, 5) } : { doctorId: doctors.data.length === 1 ? doctors.data[0].id : '', availableDate: '', startTime: '08:00', endTime: '08:30' }
  const fields = [{ name: 'doctorId', label: 'Médico', type: 'select', required: true, icon: Stethoscope, disabled: session.roles.includes('Medico'), options: doctors.data.map(x => ({ value: x.id, label: `${x.firstName} ${x.lastName}` })) }, { name: 'availableDate', label: 'Fecha', type: 'date', required: true, icon: CalendarDays }, { name: 'startTime', label: 'Hora inicial', type: 'time', required: true, icon: Clock }, { name: 'endTime', label: 'Hora final', type: 'time', required: true, icon: Clock }]
  async function submit(valuesToSave) { await mutation.mutateAsync(valuesToSave); navigate('/dashboard/horarios') }
  return <EntityForm key={id ?? 'new'} title={edit ? 'Editar franja' : 'Crear franja manual'} description="Define un bloque específico disponible para una cita." icon={Calendar} fields={fields} schema={scheduleRequestSchema} defaultValues={values} onSubmit={submit} onCancel={() => navigate('/dashboard/horarios')} isSubmitting={mutation.isPending} error={mutation.error} permissionPrefix="Schedule" permissions={session.permissions} mode={edit ? 'edit' : 'create'} />
}
