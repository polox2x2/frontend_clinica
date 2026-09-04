import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Pencil, RefreshCw } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { canPerform } from '@/shared/security/entity-permissions'

export function EntityDetail({ id, queryKey, client, title, description, icon: Icon, fields, onBack, onEdit, permissionPrefix, permissions = [] }) {
  const query = useQuery({
    queryKey: [...queryKey, 'detail', id],
    queryFn: () => client.getById(id),
    enabled: Boolean(id),
  })
  const data = query.data

  return (
    <section className="mx-auto grid w-full max-w-4xl gap-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack}><ArrowLeft /> Volver al listado</Button>
        {onEdit && data && canPerform(permissions, permissionPrefix, 'Update') && (
          <Button variant="outline" onClick={() => onEdit(data)}><Pencil /> Editar</Button>
        )}
      </div>

      {/* Cabecera */}
      <div className="flex items-center gap-4">
        {Icon && (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Icon className="size-7" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {data && <Badge variant={data.isActive ? 'default' : 'secondary'}>{data.isActive ? 'Activo' : 'Inactivo'}</Badge>}
      </div>

      {query.isPending && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-20 rounded-xl" />)}
        </div>
      )}

      {query.isError && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><RefreshCw /></EmptyMedia>
            <EmptyTitle>No se pudo cargar el registro</EmptyTitle>
            <EmptyDescription>{query.error.message}</EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" onClick={() => query.refetch()}><RefreshCw /> Reintentar</Button>
        </Empty>
      )}

      {data && (
        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const FieldIcon = field.icon
            return (
              <div key={field.key} className={cn('rounded-xl border bg-card p-4', field.colSpan === 2 && 'sm:col-span-2')}>
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {FieldIcon
                    ? <FieldIcon className="size-3.5 text-primary" />
                    : <span className="size-1.5 rounded-full bg-primary" />}
                  {field.label}
                </dt>
                <dd className="mt-1.5 break-words text-sm font-medium">
                  {field.render ? field.render(data) : (data[field.key] ?? '—')}
                </dd>
              </div>
            )
          })}
        </dl>
      )}
    </section>
  )
}
