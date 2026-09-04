import { useDeferredValue, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownAZ, ArrowUpAZ, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, RefreshCw, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { canPerform } from '@/shared/security/entity-permissions'

function HeadCells({ columns, hasAllowedActions }) {
  return (
    <TableRow className="hover:bg-transparent">
      {columns.map((column) => (
        <TableHead key={column.key} className={cn('h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground', column.className)}>
          {column.label}
        </TableHead>
      ))}
      {hasAllowedActions && <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Acciones</TableHead>}
    </TableRow>
  )
}

function CellValue({ column, item }) {
  const value = column.render ? column.render(item) : item[column.key]
  return value ?? <span className="text-muted-foreground">—</span>
}

function RowActions({ item, actions, permissions, permissionPrefix }) {
  const allowed = actions.filter((action) => action.permission
    ? new Set(permissions ?? []).has(action.permission)
    : canPerform(permissions, permissionPrefix, action.action))

  if (allowed.length === 0) return null

  return (
    <div className="flex items-center justify-end gap-1">
      {allowed.map((action) => {
        const ActionIcon = action.icon
        return (
          <Button
            key={action.label}
            size="sm"
            variant="ghost"
            className={action.variant === 'destructive' ? 'text-destructive hover:text-destructive' : 'text-muted-foreground hover:text-foreground'}
            disabled={action.disabled?.(item)}
            onClick={() => action.onClick(item)}
          >
            {ActionIcon && <ActionIcon />} {action.label}
          </Button>
        )
      })}
    </div>
  )
}

export function EntityList({
  title,
  description,
  icon: Icon,
  queryKey,
  client,
  columns,
  defaultSortBy = 'createdAt',
  searchPlaceholder = 'Buscar...',
  createLabel = 'Crear nuevo',
  onCreate,
  actions = [],
  pageSizeOptions = [10, 25, 50],
  permissionPrefix,
  permissions = [],
  headerActions,
}) {
  const sortableColumns = columns.filter((column) => column.sortable)
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])
  const [sortBy, setSortBy] = useState(() => {
    const match = sortableColumns.find((column) => (column.sortKey ?? column.key) === defaultSortBy)
    if (match) return defaultSortBy
    const first = sortableColumns[0]
    return first ? (first.sortKey ?? first.key) : defaultSortBy
  })
  const [sortDirection, setSortDirection] = useState('Ascending')
  const canCreate = onCreate && canPerform(permissions, permissionPrefix, 'Create')
  const hasAllowedActions = actions.some((action) => action.permission
    ? new Set(permissions).has(action.permission)
    : canPerform(permissions, permissionPrefix, action.action))

  const query = useQuery({
    queryKey: [...queryKey, { search: deferredSearch, page, pageSize, sortBy, sortDirection }],
    queryFn: () => client.list({ search: deferredSearch || undefined, page, pageSize, sortBy, sortDirection }),
    placeholderData: (previous) => previous,
  })

  const data = query.data
  const totalPages = Math.max(data?.totalPages ?? 1, 1)
  const from = data && data.totalCount > 0 ? (data.page - 1) * pageSize + 1 : 0
  const to = data ? Math.min(data.page * pageSize, data.totalCount) : 0

  return (
    <section className="grid gap-5">
      {/* Cabecera */}
      <div className="flex items-center gap-4">
        {Icon && (
          <span className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Icon className="size-8" />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>

      {/* Toolbar: campo de orden + búsqueda + crear (a la altura del buscador) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {sortableColumns.length > 0 && (
          <div className="flex items-center gap-2">
            <Select items={sortableColumns.map((column) => ({ value: column.sortKey ?? column.key, label: column.label }))} value={sortBy} onValueChange={(next) => { setSortBy(next); setPage(1) }}>
              <SelectTrigger className="px-3 data-[size=default]:h-10 sm:w-52" aria-label="Ordenar por"><SelectValue /></SelectTrigger>
              <SelectContent>
                {sortableColumns.map((column) => (
                  <SelectItem key={column.key} value={column.sortKey ?? column.key}>{column.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="outline"
              aria-label={sortDirection === 'Ascending' ? 'Orden ascendente' : 'Orden descendente'}
              onClick={() => setSortDirection((current) => current === 'Ascending' ? 'Descending' : 'Ascending')}
            >
              {sortDirection === 'Ascending' ? <ArrowUpAZ /> : <ArrowDownAZ />}
            </Button>
          </div>
        )}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-10 rounded-lg pl-9"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1) }}
            placeholder={searchPlaceholder}
            aria-label="Buscar registros"
          />
        </div>
        {(headerActions || canCreate) && (
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            {headerActions}
            {canCreate && (
              <Button onClick={onCreate} className="h-11 gap-2.5 rounded-xl px-5 text-sm font-medium">
                <span className="flex size-6 items-center justify-center rounded-full bg-white/25">
                  <Plus className="size-4" />
                </span>
                {createLabel}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Contenido: skeleton con forma de tabla mientras precarga */}
      {query.isPending && (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-muted"><HeadCells columns={columns} hasAllowedActions={hasAllowedActions} /></TableHeader>
            <TableBody>
              {Array.from({ length: Math.min(pageSize, 8) }, (_, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-transparent">
                  {columns.map((column) => <TableCell key={column.key} className="py-3.5"><Skeleton className="h-4 w-[70%]" /></TableCell>)}
                  {hasAllowedActions && <TableCell className="py-3.5 text-right"><Skeleton className="ml-auto h-7 w-24 rounded-md" /></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {query.isError && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><RefreshCw /></EmptyMedia>
            <EmptyTitle>No se pudo cargar el listado</EmptyTitle>
            <EmptyDescription>{query.error.message}</EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" onClick={() => query.refetch()}><RefreshCw /> Reintentar</Button>
        </Empty>
      )}

      {data?.isEmpty && !query.isError && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><Search /></EmptyMedia>
            <EmptyTitle>Sin resultados</EmptyTitle>
            <EmptyDescription>{search ? 'Prueba con un término de búsqueda diferente.' : 'Todavía no existen registros.'}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {data && !data.isEmpty && (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-muted"><HeadCells columns={columns} hasAllowedActions={hasAllowedActions} /></TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.id} className="transition-colors even:bg-muted/25 hover:bg-muted/60">
                  {columns.map((column) => <TableCell key={column.key} className={cn('py-3.5', column.className)}><CellValue column={column} item={item} /></TableCell>)}
                  {hasAllowedActions && <TableCell className="py-3.5 text-right"><RowActions item={item} actions={actions} permissions={permissions} permissionPrefix={permissionPrefix} /></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Footer */}
      {data && !data.isEmpty && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Resultados por página</span>
            <Select items={pageSizeOptions.map((size) => ({ value: String(size), label: String(size) }))} value={String(pageSize)} onValueChange={(next) => { setPageSize(Number(next)); setPage(1) }}>
              <SelectTrigger className="w-20 data-[size=default]:h-9" aria-label="Resultados por página"><SelectValue /></SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}
              </SelectContent>
            </Select>
            <span>{from}–{to} de {data.totalCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-sm text-muted-foreground">Página {data.page} de {totalPages}</span>
            <Button size="icon-sm" variant="outline" aria-label="Primera página" disabled={!data.hasPreviousPage || query.isFetching} onClick={() => setPage(1)}><ChevronsLeft /></Button>
            <Button size="icon-sm" variant="outline" aria-label="Página anterior" disabled={!data.hasPreviousPage || query.isFetching} onClick={() => setPage((current) => current - 1)}><ChevronLeft /></Button>
            <Button size="icon-sm" variant="outline" aria-label="Página siguiente" disabled={!data.hasNextPage || query.isFetching} onClick={() => setPage((current) => current + 1)}><ChevronRight /></Button>
            <Button size="icon-sm" variant="outline" aria-label="Última página" disabled={!data.hasNextPage || query.isFetching} onClick={() => setPage(totalPages)}><ChevronsRight /></Button>
          </div>
        </div>
      )}
    </section>
  )
}
