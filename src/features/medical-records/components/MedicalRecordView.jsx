import { CalendarDays, Droplet, FileText, Pill, Plus, RefreshCw, Stethoscope, TriangleAlert, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

const dateTime = new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeStyle: 'short' })

function Vital({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
      <span className={`flex size-9 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
    </div>
  )
}

function EntryField({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </p>
      <p className="mt-0.5 whitespace-pre-line text-sm">{value}</p>
    </div>
  )
}

export function MedicalRecordView({ query, onAdd }) {
  if (query.isPending) {
    return <div className="grid gap-3">{[1, 2, 3].map((x) => <Skeleton key={x} className="h-28" />)}</div>
  }

  if (query.isError) {
    const notFound = query.error.status === 404
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><RefreshCw /></EmptyMedia>
          <EmptyTitle>{notFound ? 'Aún no existe historia clínica' : 'No se pudo cargar la historia'}</EmptyTitle>
          <EmptyDescription>
            {notFound ? 'Se creará con la primera atención registrada por un médico.' : query.error.message}
          </EmptyDescription>
        </EmptyHeader>
        {onAdd && <Button onClick={onAdd}><Plus /> Registrar primera atención</Button>}
      </Empty>
    )
  }

  const record = query.data

  return (
    <div className="grid gap-6">
      {/* Cabecera del paciente + signos vitales */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserRound className="size-6" />
              </span>
              <div>
                <CardTitle>{record.patientName}</CardTitle>
                <CardDescription>Historia clínica · {record.entries.length} atención{record.entries.length === 1 ? '' : 'es'}</CardDescription>
              </div>
            </div>
            {onAdd && <Button onClick={onAdd}><Plus /> Nueva atención</Button>}
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Vital icon={Droplet} label="Tipo de sangre" value={record.bloodType || 'No registrado'} tone="bg-red-500/10 text-red-600 dark:text-red-400" />
          <Vital icon={TriangleAlert} label="Alergias" value={record.allergies || 'Ninguna registrada'} tone="bg-amber-500/10 text-amber-600 dark:text-amber-400" />
        </CardContent>
      </Card>

      {/* Timeline de atenciones */}
      <div className="grid gap-4">
        <h2 className="flex items-center gap-2 font-semibold">
          <CalendarDays className="size-5 text-primary" /> Línea de tiempo
        </h2>

        {record.entries.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><FileText /></EmptyMedia>
              <EmptyTitle>Sin atenciones registradas</EmptyTitle>
              <EmptyDescription>Las atenciones aparecerán aquí en orden cronológico.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ol className="relative ml-3 grid gap-5 border-l-2 border-border pl-7">
            {record.entries.map((entry) => (
              <li key={entry.id} className="relative">
                <span className="absolute -left-[38px] top-1 flex size-5 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow">
                  <Stethoscope className="size-2.5" />
                </span>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{entry.reason || 'Atención médica'}</CardTitle>
                    <CardDescription>{dateTime.format(new Date(entry.createdAt))} · Dr. {entry.doctorName}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <EntryField icon={Stethoscope} label="Diagnóstico" value={entry.diagnosis} />
                    <EntryField icon={Pill} label="Tratamiento" value={entry.treatment} />
                    <div className="sm:col-span-2"><EntryField icon={FileText} label="Notas" value={entry.notes} /></div>
                    {!entry.diagnosis && !entry.treatment && !entry.notes && (
                      <p className="text-sm text-muted-foreground">Sin detalles clínicos adicionales.</p>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
