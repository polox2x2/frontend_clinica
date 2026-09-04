import { useQuery } from '@tanstack/react-query'
import { AlignLeft, ListTree, Stethoscope } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '@/features/auth'
import { listSpecialityOptions, specialitiesClient } from '@/features/specialities/api/specialities-api'
import { specialityKeys, useCreateSpeciality, useUpdateSpeciality } from '@/features/specialities/hooks/use-speciality-mutations'
import { specialityRequestSchema } from '@/features/specialities/schemas/speciality-schemas'
import { AppLoading } from '@/shared/components/feedback/AppLoading'
import { EntityForm } from '@/shared/crud'

export default function SpecialityFormPage() {
  const { id } = useParams(); const isEdit = Boolean(id); const navigate = useNavigate(); const { data: session } = useSession()
  const options = useQuery({ queryKey: [...specialityKeys.all, 'options'], queryFn: listSpecialityOptions })
  const speciality = useQuery({ queryKey: [...specialityKeys.all, 'detail', id], queryFn: () => specialitiesClient.getById(id), enabled: isEdit })
  const createMutation = useCreateSpeciality(); const updateMutation = useUpdateSpeciality(id); const mutation = isEdit ? updateMutation : createMutation
  if (options.isPending || (isEdit && speciality.isPending)) return <AppLoading label="Preparando formulario" />
  const loadError = options.error ?? speciality.error; if (loadError) throw loadError
  const current = speciality.data
  const values = isEdit ? { name: current.name, description: current.description ?? '', parentId: current.parentId ?? '' } : { name: '', description: '', parentId: '' }
  const fields = [
    { name: 'name', label: 'Nombre', placeholder: 'Ej: Cardiología', required: true, icon: Stethoscope },
    { name: 'parentId', label: 'Especialidad padre', type: 'select', placeholder: 'Sin especialidad padre', icon: ListTree, options: options.data.filter((item) => item.id !== id && !item.parentId).map((item) => ({ value: item.id, label: item.name })) },
    { name: 'description', label: 'Descripción', placeholder: 'Describe el alcance de la especialidad médica...', type: 'textarea', rows: 4, colSpan: 2, icon: AlignLeft },
  ]
  async function submit(data) { await mutation.mutateAsync(data); navigate('/dashboard/especialidades') }
  return <EntityForm key={id ?? 'new'} title={isEdit ? `Editar ${current.name}` : 'Crear especialidad médica'} description={isEdit ? 'Actualiza los datos o su relación jerárquica.' : 'Registra una especialidad o subespecialidad para el equipo médico.'} icon={Stethoscope} fields={fields} schema={specialityRequestSchema} defaultValues={values} onSubmit={submit} onCancel={() => navigate('/dashboard/especialidades')} submitLabel={isEdit ? 'Guardar cambios' : 'Crear especialidad'} isSubmitting={mutation.isPending} error={mutation.error} permissionPrefix="Speciality" permissions={session.permissions} mode={isEdit ? 'edit' : 'create'} />
}
