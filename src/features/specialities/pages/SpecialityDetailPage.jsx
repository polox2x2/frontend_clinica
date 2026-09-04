import { Badge } from '@/components/ui/badge'
import { Stethoscope } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '@/features/auth'
import { specialitiesClient } from '@/features/specialities/api/specialities-api'
import { specialityKeys } from '@/features/specialities/hooks/use-speciality-mutations'
import { EntityDetail } from '@/shared/crud'

export default function SpecialityDetailPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { data: session } = useSession()
  const fields = [
    { key: 'name', label: 'Nombre' },
    { key: 'parentName', label: 'Clasificación', render: (item) => item.parentName ? <Badge variant="secondary">Subespecialidad de {item.parentName}</Badge> : <Badge variant="outline">Especialidad principal</Badge> },
    { key: 'description', label: 'Descripción', colSpan: 2 },
    { key: 'createdAt', label: 'Fecha de creación', render: (item) => new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(item.createdAt)) },
  ]
  return <EntityDetail id={id} queryKey={specialityKeys.all} client={specialitiesClient} title="Detalle de especialidad" description="Información y clasificación de la especialidad médica." icon={Stethoscope} fields={fields} onBack={() => navigate('/dashboard/especialidades')} onEdit={(item) => navigate(`/dashboard/especialidades/${item.id}/editar`)} permissionPrefix="Speciality" permissions={session.permissions} />
}
