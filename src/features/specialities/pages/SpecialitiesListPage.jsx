import { useState } from 'react'
import { Eye, Pencil, Stethoscope, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useSession } from '@/features/auth'
import { specialitiesClient } from '@/features/specialities/api/specialities-api'
import { specialityKeys, useDeleteSpeciality } from '@/features/specialities/hooks/use-speciality-mutations'
import { EntityList } from '@/shared/crud'

export default function SpecialitiesListPage() {
  const navigate = useNavigate(); const { data: session } = useSession(); const remove = useDeleteSpeciality(); const [selected, setSelected] = useState(null)
  const columns = [
    { key: 'name', label: 'Nombre', sortable: true, render: (item) => <span className="font-medium">{item.name}</span> },
    { key: 'parentName', label: 'Tipo', render: (item) => item.parentName ? <Badge variant="secondary">Subespecialidad</Badge> : <Badge variant="outline">Principal</Badge> },
    { key: 'description', label: 'Descripción' },
  ]
  const actions = [
    { action: 'Read', label: 'Ver detalle', icon: Eye, onClick: (item) => navigate(`/dashboard/especialidades/${item.id}`) },
    { action: 'Update', label: 'Editar', icon: Pencil, onClick: (item) => navigate(`/dashboard/especialidades/${item.id}/editar`) },
    { action: 'Delete', label: 'Eliminar', icon: Trash2, variant: 'destructive', onClick: setSelected },
  ]
  async function confirmDelete() { try { await remove.mutateAsync(selected.id); setSelected(null) } catch { /* conserva el dialogo */ } }
  return <><EntityList title="Especialidades" description="Administra especialidades médicas y sus subespecialidades." icon={Stethoscope} queryKey={specialityKeys.all} client={specialitiesClient} columns={columns} defaultSortBy="name" searchPlaceholder="Buscar por nombre..." createLabel="Crear especialidad" onCreate={() => navigate('/dashboard/especialidades/nuevo')} actions={actions} permissionPrefix="Speciality" permissions={session.permissions} /><AlertDialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogMedia><Trash2 /></AlertDialogMedia><AlertDialogTitle>¿Desactivar esta especialidad?</AlertDialogTitle><AlertDialogDescription>La especialidad {selected?.name} dejará de aparecer en los listados. Revisa antes si tiene subespecialidades o médicos asociados.{remove.error && <span className="mt-2 block text-destructive">{remove.error.message}</span>}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={remove.isPending}>Cancelar</AlertDialogCancel><AlertDialogAction variant="destructive" disabled={remove.isPending} onClick={confirmDelete}>{remove.isPending ? 'Desactivando...' : 'Desactivar'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></>
}
