import { UserRound } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '@/features/auth'
import { patientsClient } from '@/features/patients/api/patients-api'
import { patientKeys } from '@/features/patients/hooks/use-patient-mutations'
import { EntityDetail } from '@/shared/crud'
const date = new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' })
export default function PatientDetailPage() { const { id } = useParams(); const navigate = useNavigate(); const { data: session } = useSession(); const fields = [{ key: 'documentId', label: 'Documento' }, { key: 'username', label: 'Usuario' }, { key: 'firstName', label: 'Nombre completo', render: (item) => `${item.firstName} ${item.lastName}` }, { key: 'email', label: 'Correo' }, { key: 'phone', label: 'Teléfono' }, { key: 'dateOfBirth', label: 'Fecha de nacimiento', render: (item) => item.dateOfBirth ? date.format(new Date(`${item.dateOfBirth}T00:00:00`)) : 'No registrada' }, { key: 'createdAt', label: 'Fecha de registro', render: (item) => date.format(new Date(item.createdAt)) }]; return <EntityDetail id={id} queryKey={patientKeys.all} client={patientsClient} title="Detalle del paciente" description="Información personal, de contacto y cuenta asociada." icon={UserRound} fields={fields} onBack={() => navigate('/dashboard/pacientes')} onEdit={(item) => navigate(`/dashboard/pacientes/${item.id}/editar`)} permissionPrefix="Patient" permissions={session.permissions} /> }
