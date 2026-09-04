import { useQuery } from '@tanstack/react-query'
import { CalendarDays, CalendarPlus, Stethoscope } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@/features/auth'
import { listAccessibleDoctorOptions } from '@/features/doctors/api/doctors-api'
import { useGenerateSchedules } from '@/features/schedules/hooks/use-schedule-mutations'
import { generateScheduleSchema } from '@/features/schedules/schemas/schedule-schemas'
import { AppLoading } from '@/shared/components/feedback/AppLoading'
import { EntityForm } from '@/shared/crud'
export default function GenerateSchedulesPage() {
  const navigate = useNavigate(); const { data: session } = useSession(); const doctors = useQuery({ queryKey: ['doctors', 'generate-options', session.username], queryFn: () => listAccessibleDoctorOptions(session) }); const mutation = useGenerateSchedules()
  if (doctors.isPending) return <AppLoading label="Preparando generación" />; if (doctors.error) throw doctors.error
  const fields = [{ name: 'doctorId', label: 'Médico', type: 'select', required: true, icon: Stethoscope, disabled: session.roles.includes('Medico'), options: doctors.data.map(x => ({ value: x.id, label: `${x.firstName} ${x.lastName}` })) }, { name: 'fromDate', label: 'Desde', type: 'date', required: true, icon: CalendarDays }, { name: 'toDate', label: 'Hasta', type: 'date', required: true, icon: CalendarDays }]
  async function submit(values) { const result = await mutation.mutateAsync(values); navigate('/dashboard/horarios', { state: { generated: result.generated } }) }
  return <EntityForm title="Generar horarios" description="Crea franjas desde la disponibilidad semanal, omitiendo ausencias y duplicados." icon={CalendarPlus} fields={fields} schema={generateScheduleSchema} defaultValues={{ doctorId: doctors.data.length === 1 ? doctors.data[0].id : '', fromDate: '', toDate: '' }} onSubmit={submit} onCancel={() => navigate('/dashboard/horarios')} submitLabel="Generar franjas" isSubmitting={mutation.isPending} error={mutation.error} permissionPrefix="Schedule" permissions={session.permissions} />
}
