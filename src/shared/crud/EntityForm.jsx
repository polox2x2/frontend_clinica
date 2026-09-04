import { lazy, Suspense, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, CalendarDays, Check, X } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { canPerform } from '@/shared/security/entity-permissions'

// El Calendar (react-day-picker) es pesado: se carga solo al abrir un campo de fecha,
// para no inflar el bundle de los listados/formularios que no usan fechas.
const Calendar = lazy(() => import('@/components/ui/calendar').then((module) => ({ default: module.Calendar })))

function validationErrors(error) {
  return Object.fromEntries(
    error.issues.filter((issue) => issue.path.length).map((issue) => [issue.path[0], issue.message]),
  )
}

function DateField({ field, value, setValue, error, disabled }) {
  const [open, setOpen] = useState(false)
  const date = value ? new Date(`${value}T00:00:00`) : undefined
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            id={field.name}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={cn('h-10 w-full justify-start gap-2 px-3 font-normal', !date && 'text-muted-foreground')}
          />
        }
      >
        <CalendarDays className="text-muted-foreground" />
        {date ? format(date, "d 'de' MMMM 'de' yyyy", { locale: es }) : (field.placeholder ?? 'Selecciona una fecha')}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Suspense fallback={<div className="flex size-64 items-center justify-center"><Spinner /></div>}>
          <Calendar
            mode="single"
            selected={date}
            locale={es}
            onSelect={(selected) => { if (selected) { setValue(format(selected, 'yyyy-MM-dd')); setOpen(false) } }}
          />
        </Suspense>
      </PopoverContent>
    </Popover>
  )
}

function FieldControl({ field, value, setValue, error, disabled }) {
  const common = {
    id: field.name,
    name: field.name,
    disabled,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${field.name}-error` : undefined,
  }

  if (field.render) return field.render({ value, setValue, error, disabled })
  if (field.type === 'textarea') {
    return <Textarea {...common} rows={field.rows ?? 4} placeholder={field.placeholder} value={value ?? ''} onChange={(event) => setValue(event.target.value)} />
  }
  if (field.type === 'select') {
    return (
      <Select items={field.options} value={value ?? ''} onValueChange={setValue} disabled={disabled}>
        <SelectTrigger id={field.name} aria-invalid={Boolean(error)} className="w-full px-3 data-[size=default]:h-10">
          <SelectValue placeholder={field.placeholder ?? 'Seleccionar'} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectContent>
      </Select>
    )
  }
  if (field.type === 'date') {
    return <DateField field={field} value={value} setValue={setValue} error={error} disabled={disabled} />
  }
  if (field.type === 'switch') {
    return <Switch {...common} checked={Boolean(value)} onCheckedChange={setValue} />
  }
  return (
    <Input
      {...common}
      className="h-10"
      type={field.type ?? 'text'}
      autoComplete={field.autoComplete ?? (field.type === 'password' ? 'current-password' : undefined)}
      placeholder={field.placeholder}
      value={value ?? ''}
      onChange={(event) => setValue(field.type === 'number' && event.target.value !== '' ? Number(event.target.value) : event.target.value)}
    />
  )
}

export function EntityForm({
  title,
  description,
  icon: Icon,
  fields,
  schema,
  defaultValues = {},
  onSubmit,
  onCancel,
  backLabel = 'Volver al listado',
  submitLabel = 'Guardar',
  isSubmitting = false,
  error,
  permissionPrefix,
  permissions = [],
  mode = 'create',
}) {
  const [values, setValues] = useState(defaultValues)
  const [errors, setErrors] = useState({})
  const allowed = canPerform(permissions, permissionPrefix, mode === 'edit' ? 'Update' : 'Create')

  async function handleSubmit(event) {
    event.preventDefault()
    const parsed = schema.safeParse(values)
    if (!parsed.success) {
      setErrors(validationErrors(parsed.error))
      return
    }
    setErrors({})
    if (!allowed) return
    try {
      await onSubmit(parsed.data)
    } catch (submissionError) {
      const details = submissionError?.details
      if (details && typeof details === 'object' && !Array.isArray(details)) {
        setErrors(Object.fromEntries(Object.entries(details).filter(([, message]) => typeof message === 'string')))
      }
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-6">
      <Button className="w-fit" variant="ghost" onClick={onCancel}><ArrowLeft /> {backLabel}</Button>
      <div className="text-center">
        {Icon && <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Icon className="size-7" /></div>}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      </div>
      <form onSubmit={handleSubmit} noValidate className="grid gap-6">
        <FieldGroup className="grid gap-5 md:grid-cols-2">
          {error && <Alert variant="destructive" className="md:col-span-2"><AlertDescription>{error.message}</AlertDescription></Alert>}
          {fields.map((field) => (
            <Field key={field.name} data-invalid={Boolean(errors[field.name])} className={cn(field.colSpan === 2 && 'md:col-span-2')}>
              <FieldLabel htmlFor={field.name}>{field.icon && <field.icon className="size-4 text-primary" />}{field.label}{field.required && <span className="text-destructive">*</span>}</FieldLabel>
              <FieldControl field={field} value={values[field.name]} setValue={(value) => setValues((current) => ({ ...current, [field.name]: value }))} error={errors[field.name]} disabled={!allowed || isSubmitting || field.disabled} />
              {field.description && <FieldDescription>{field.description}</FieldDescription>}
              {errors[field.name] && <FieldError id={`${field.name}-error`}>{errors[field.name]}</FieldError>}
            </Field>
          ))}
        </FieldGroup>
        <div className="flex justify-end gap-3 border-t pt-5">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}><X /> Cancelar</Button>
          {allowed && <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Spinner /> : <Check />}{isSubmitting ? 'Guardando...' : submitLabel}</Button>}
        </div>
      </form>
    </section>
  )
}
