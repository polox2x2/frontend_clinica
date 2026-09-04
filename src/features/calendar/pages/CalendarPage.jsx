import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, ChevronLeft, ChevronRight, RefreshCw, Stethoscope } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { subscribe, websocketDestinations } from '@/core'
import { useSession } from '@/features/auth'
import { getDoctorCalendar, getMyCalendar } from '@/features/calendar/api/calendar-api'
import { listDoctorOptions } from '@/features/doctors/api/doctors-api'

const today = () => new Date().toISOString().slice(0, 10)
const iso = (d) => d.toISOString().slice(0, 10)

const labels = { FREE: 'Libre', PENDING: 'Pendiente', CONFIRMED: 'Confirmada', RESCHEDULED: 'Reprogramada', COMPLETED: 'Completada', NO_SHOW: 'Inasistencia', CANCELLED: 'Cancelada', REJECTED: 'Rechazada' }

// Estilo de cada evento por estado (borde izquierdo + fondo suave).
const eventStyles = {
  FREE: 'border-l-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  PENDING: 'border-l-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  CONFIRMED: 'border-l-primary bg-primary/10 text-primary',
  RESCHEDULED: 'border-l-violet-500 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  COMPLETED: 'border-l-slate-400 bg-slate-500/10 text-slate-600 dark:text-slate-300',
  NO_SHOW: 'border-l-red-500 bg-red-500/10 text-red-700 dark:text-red-300',
  CANCELLED: 'border-l-red-500 bg-red-500/10 text-red-700 dark:text-red-300',
  REJECTED: 'border-l-red-500 bg-red-500/10 text-red-700 dark:text-red-300',
}

const DOW = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function mondayOf(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`)
  const dow = (d.getDay() + 6) % 7 // 0 = lunes
  d.setDate(d.getDate() - dow)
  return d
}
function weekDays(dateStr) {
  const monday = mondayOf(dateStr)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return iso(d)
  })
}
function groupByDate(events) {
  const map = new Map()
  for (const e of events ?? []) {
    if (!map.has(e.date)) map.set(e.date, [])
    map.get(e.date).push(e)
  }
  for (const list of map.values()) list.sort((a, b) => a.startTime.localeCompare(b.startTime))
  return map
}

function EventCard({ event, onOpen }) {
  const clickable = Boolean(event.appointmentId)
  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => clickable && onOpen(event.appointmentId)}
      className={cn(
        'w-full rounded-md border border-l-4 px-2 py-1.5 text-left text-xs transition',
        eventStyles[event.status] ?? 'border-l-border bg-muted',
        clickable ? 'hover:shadow-sm' : 'cursor-default',
      )}
    >
      <div className="font-medium tabular-nums">{event.startTime.slice(0, 5)}–{event.endTime.slice(0, 5)}</div>
      <div className="truncate opacity-90">{event.status === 'FREE' ? labels.FREE : (event.patientName ?? labels[event.status] ?? event.status)}</div>
    </button>
  )
}

function WeekView({ days, byDate, onOpen }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[720px] grid-cols-7 gap-2">
        {days.map((day) => {
          const list = byDate.get(day) ?? []
          const d = new Date(`${day}T00:00:00`)
          const isToday = day === today()
          return (
            <div key={day} className="flex flex-col">
              <div className={cn('mb-2 rounded-md border px-2 py-1.5 text-center', isToday && 'border-primary bg-primary/5')}>
                <div className="text-[11px] uppercase text-muted-foreground">{DOW[(d.getDay() + 6) % 7]}</div>
                <div className={cn('text-lg font-semibold leading-none', isToday && 'text-primary')}>{d.getDate()}</div>
              </div>
              <div className="grid content-start gap-1.5">
                {list.length === 0
                  ? <div className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">—</div>
                  : list.map((e) => <EventCard key={e.scheduleId} event={e} onOpen={onOpen} />)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DayView({ date, byDate, onOpen }) {
  const list = byDate.get(date) ?? []
  const d = new Date(`${date}T00:00:00`)
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-3 text-center">
        <div className="text-sm text-muted-foreground">{DOW[(d.getDay() + 6) % 7]}</div>
        <div className="text-2xl font-semibold">{d.getDate()} de {MONTHS[d.getMonth()]}</div>
      </div>
      <div className="grid gap-2">
        {list.map((e) => <EventCard key={e.scheduleId} event={e} onOpen={onOpen} />)}
      </div>
    </div>
  )
}

function MonthView({ date, byDate, onPickDay }) {
  const ref = new Date(`${date}T12:00:00`)
  const year = ref.getFullYear()
  const month = ref.getMonth()
  const first = new Date(year, month, 1)
  const lead = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]
  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] uppercase text-muted-foreground">
        {DOW.map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          if (!cell) return <div key={`b${index}`} />
          const day = iso(cell)
          const list = byDate.get(day) ?? []
          const booked = list.filter((e) => e.status !== 'FREE').length
          const free = list.length - booked
          const isToday = day === today()
          return (
            <button
              key={day}
              type="button"
              onClick={() => onPickDay(day)}
              className={cn(
                'flex min-h-20 flex-col rounded-md border p-1.5 text-left transition hover:border-primary',
                isToday && 'border-primary bg-primary/5',
              )}
            >
              <span className={cn('text-sm font-medium', isToday && 'text-primary')}>{cell.getDate()}</span>
              <span className="mt-auto flex flex-wrap gap-1">
                {booked > 0 && <Badge className="px-1.5 py-0 text-[10px]">{booked}</Badge>}
                {free > 0 && <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">{free} libre{free > 1 ? 's' : ''}</Badge>}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const canChoose = session.permissions.includes('Doctor:List')
  const [doctorId, setDoctorId] = useState('')
  const [view, setView] = useState('week')
  const [date, setDate] = useState(today())

  const doctors = useQuery({ queryKey: ['doctors', 'calendar-options'], queryFn: listDoctorOptions, enabled: canChoose })
  const own = !canChoose
  const events = useQuery({
    queryKey: ['calendar', own ? 'me' : doctorId, view, date],
    queryFn: () => (own ? getMyCalendar({ view, date }) : getDoctorCalendar({ doctorId, view, date })),
    enabled: own || Boolean(doctorId),
  })

  useEffect(() => {
    const unsubs = [subscribe(websocketDestinations.appointments, () => queryClient.invalidateQueries({ queryKey: ['calendar'] }))]
    if (doctorId) unsubs.push(subscribe(websocketDestinations.doctorCalendar(doctorId), () => queryClient.invalidateQueries({ queryKey: ['calendar'] })))
    return () => unsubs.forEach((fn) => fn())
  }, [doctorId, queryClient])

  function move(amount) {
    const d = new Date(`${date}T12:00:00`)
    d.setDate(d.getDate() + amount * (view === 'day' ? 1 : view === 'week' ? 7 : 30))
    setDate(iso(d))
  }
  function openAppointment(id) {
    navigate(`/dashboard/citas/${id}`)
  }
  function pickDay(day) {
    setDate(day)
    setView('day')
  }

  const byDate = groupByDate(events.data)
  const rangeLabel = view === 'month'
    ? `${MONTHS[new Date(`${date}T12:00:00`).getMonth()]} ${new Date(`${date}T12:00:00`).getFullYear()}`
    : view === 'week'
      ? (() => { const days = weekDays(date); const a = new Date(`${days[0]}T00:00:00`); const b = new Date(`${days[6]}T00:00:00`); return `${a.getDate()} – ${b.getDate()} ${MONTHS[b.getMonth()]}` })()
      : new Intl.DateTimeFormat('es-PE', { dateStyle: 'full' }).format(new Date(`${date}T00:00:00`))

  return (
    <section className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-6 text-primary" />
            <h1 className="text-2xl font-semibold">Agenda médica</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Franjas libres, reservas y estado de las citas en tiempo real.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['day', 'week', 'month'].map((v) => (
            <Button key={v} size="sm" variant={view === v ? 'default' : 'outline'} onClick={() => setView(v)}>
              {v === 'day' ? 'Día' : v === 'week' ? 'Semana' : 'Mes'}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="capitalize">{rangeLabel}</CardTitle>
              <CardDescription>Toca una cita para ver su detalle.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {canChoose && (
                <NativeSelect className="min-w-56" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                  <NativeSelectOption value="">Selecciona un médico</NativeSelectOption>
                  {doctors.data?.map((d) => <NativeSelectOption key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</NativeSelectOption>)}
                </NativeSelect>
              )}
              <Button size="icon" variant="outline" onClick={() => move(-1)} aria-label="Anterior"><ChevronLeft /></Button>
              <Input className="w-auto" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <Button size="icon" variant="outline" onClick={() => move(1)} aria-label="Siguiente"><ChevronRight /></Button>
              <Button variant="ghost" onClick={() => setDate(today())}>Hoy</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {events.isPending && events.fetchStatus !== 'idle' && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {Array.from({ length: 7 }, (_, i) => <Skeleton key={i} className="h-40" />)}
            </div>
          )}
          {events.isError && (
            <Empty><EmptyHeader><EmptyMedia variant="icon"><RefreshCw /></EmptyMedia><EmptyTitle>No se pudo cargar la agenda</EmptyTitle><EmptyDescription>{events.error.message}</EmptyDescription></EmptyHeader></Empty>
          )}
          {events.fetchStatus === 'idle' && (
            <Empty><EmptyHeader><EmptyMedia variant="icon"><Stethoscope /></EmptyMedia><EmptyTitle>Selecciona un médico</EmptyTitle><EmptyDescription>Su agenda aparecerá aquí.</EmptyDescription></EmptyHeader></Empty>
          )}
          {events.data?.length === 0 && (
            <Empty><EmptyHeader><EmptyMedia variant="icon"><CalendarDays /></EmptyMedia><EmptyTitle>Sin franjas en este periodo</EmptyTitle><EmptyDescription>Genera horarios desde la plantilla semanal del médico.</EmptyDescription></EmptyHeader></Empty>
          )}
          {events.data?.length > 0 && view === 'week' && <WeekView days={weekDays(date)} byDate={byDate} onOpen={openAppointment} />}
          {events.data?.length > 0 && view === 'day' && <DayView date={date} byDate={byDate} onOpen={openAppointment} />}
          {events.data?.length > 0 && view === 'month' && <MonthView date={date} byDate={byDate} onPickDay={pickDay} />}
        </CardContent>
      </Card>
    </section>
  )
}
