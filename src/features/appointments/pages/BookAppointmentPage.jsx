import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarPlus, CalendarX, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useBookAppointment } from '@/features/appointments/hooks/use-appointment-mutations'
import { appointmentRequestSchema } from '@/features/appointments/schemas/appointment-schemas'
import { schedulesClient } from '@/features/schedules/api/schedules-api'
import { AppLoading } from '@/shared/components/feedback/AppLoading'
import { cn } from '@/lib/utils'

const dayFmt = new Intl.DateTimeFormat('es-PE', { dateStyle: 'full' })

// Franjas libres y futuras (misma regla que el backend: no reservadas y no pasadas).
function freeFutureSlots(items) {
  const now = new Date()
  return (items ?? []).filter((s) => !s.booked && new Date(`${s.availableDate}T${s.startTime}`) > now)
}

export default function BookAppointmentPage() {
  const navigate = useNavigate()
  const book = useBookAppointment()
  const slotsQuery = useQuery({
    queryKey: ['schedules', 'free-slots'],
    queryFn: () => schedulesClient.list({ pageSize: 500, sortBy: 'availableDate', sortDirection: 'Ascending' }),
  })

  const [day, setDay] = useState('')
  const [scheduleId, setScheduleId] = useState('')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState('')

  const byDay = useMemo(() => {
    const map = new Map()
    for (const slot of freeFutureSlots(slotsQuery.data?.items)) {
      if (!map.has(slot.availableDate)) map.set(slot.availableDate, [])
      map.get(slot.availableDate).push(slot)
    }
    for (const list of map.values()) list.sort((a, b) => a.startTime.localeCompare(b.startTime))
    return map
  }, [slotsQuery.data])

  if (slotsQuery.isPending) return <AppLoading label="Buscando franjas disponibles" />
  if (slotsQuery.error) throw slotsQuery.error

  const days = [...byDay.keys()].sort()
  const times = day ? (byDay.get(day) ?? []) : []

  function pickDay(value) {
    setDay(value)
    setScheduleId('')
    setFormError('')
  }

  async function submit() {
    setFormError('')
    if (!scheduleId) { setFormError('Selecciona una hora disponible.'); return }
    const parsed = appointmentRequestSchema.safeParse({ scheduleId, patientId: '', notes })
    if (!parsed.success) { setFormError(parsed.error.issues[0]?.message ?? 'Revisa los datos.'); return }
    try {
      await book.mutateAsync(parsed.data)
      navigate('/dashboard/citas')
    } catch {
      /* book.error se muestra en el panel */
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-3xl gap-6">
      <Button variant="ghost" className="w-fit" onClick={() => navigate('/dashboard/citas')}>
        <ArrowLeft /> Volver a citas
      </Button>

      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <CalendarPlus className="size-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Reservar cita</h1>
        <p className="mt-1 text-muted-foreground">Elige un día y luego una hora disponible. La cita quedará pendiente de confirmación.</p>
      </div>

      {days.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><CalendarX /></EmptyMedia>
            <EmptyTitle>No hay franjas disponibles</EmptyTitle>
            <EmptyDescription>Aún no hay horarios libres para reservar. Vuelve más tarde o contacta a la clínica.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card>
          <CardHeader><CardTitle>Datos de la cita</CardTitle></CardHeader>
          <CardContent className="grid gap-6">
            {/* Paso 1: día */}
            <div className="grid gap-1.5">
              <label htmlFor="day" className="text-sm font-medium">1. Día</label>
              <Select items={days.map((value) => ({ value, label: dayFmt.format(new Date(`${value}T00:00:00`)) }))} value={day} onValueChange={pickDay}>
                <SelectTrigger id="day" className="w-full px-3 data-[size=default]:h-10">
                  <SelectValue placeholder="Selecciona un día con horarios libres" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((value) => (
                    <SelectItem key={value} value={value}>{dayFmt.format(new Date(`${value}T00:00:00`))}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Paso 2: hora */}
            {day && (
              <div className="grid gap-2">
                <p className="text-sm font-medium">2. Hora</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {times.map((slot) => {
                    const selected = slot.id === scheduleId
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => { setScheduleId(slot.id); setFormError('') }}
                        className={cn(
                          'flex flex-col items-center rounded-lg border px-2 py-2 text-sm transition',
                          selected
                            ? 'border-primary bg-primary/10 font-medium text-primary'
                            : 'hover:border-primary/50 hover:bg-muted',
                        )}
                      >
                        <span>{slot.startTime.slice(0, 5)}–{slot.endTime.slice(0, 5)}</span>
                        <span className="mt-0.5 truncate text-xs text-muted-foreground">{slot.doctorName}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Notas */}
            <div className="grid gap-1.5">
              <label htmlFor="notes" className="text-sm font-medium">Notas (opcional)</label>
              <Textarea id="notes" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Motivo de la consulta o información para el médico." />
            </div>

            {(formError || book.error) && (
              <Alert variant="destructive"><AlertDescription>{formError || book.error.message}</AlertDescription></Alert>
            )}

            <div className="flex justify-end gap-3 border-t pt-5">
              <Button variant="outline" onClick={() => navigate('/dashboard/citas')} disabled={book.isPending}>Cancelar</Button>
              <Button onClick={submit} disabled={book.isPending || !scheduleId}>
                {book.isPending ? <Spinner /> : <Check />}
                {book.isPending ? 'Reservando...' : 'Reservar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
