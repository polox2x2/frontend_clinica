import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

export function PermissionSelector({ permissions, value = [], setValue, disabled }) {
  const [search, setSearch] = useState('')
  const groups = useMemo(() => {
    const filtered = permissions.filter((permission) => `${permission.name} ${permission.description ?? ''}`.toLowerCase().includes(search.toLowerCase()))
    return filtered.reduce((result, permission) => {
      const group = permission.groupName || 'Otros'
      result[group] ??= []
      result[group].push(permission)
      return result
    }, {})
  }, [permissions, search])

  function toggle(permissionId, checked) {
    setValue(checked ? [...new Set([...value, permissionId])] : value.filter((id) => id !== permissionId))
  }

  function toggleGroup(groupPermissions) {
    const ids = groupPermissions.map((permission) => permission.id)
    const allSelected = ids.every((id) => value.includes(id))
    setValue(allSelected ? value.filter((id) => !ids.includes(id)) : [...new Set([...value, ...ids])])
  }

  return (
    <div className="rounded-lg border">
      <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-9 pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar permisos..." disabled={disabled} />
        </div>
        <Badge variant="secondary">{value.length} seleccionados</Badge>
      </div>
      <ScrollArea className="h-80">
        <div className="grid gap-5 p-4">
          {Object.entries(groups).map(([groupName, groupPermissions]) => (
            <section key={groupName} className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">{groupName}</h3>
                <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => toggleGroup(groupPermissions)}>
                  {groupPermissions.every((permission) => value.includes(permission.id)) ? 'Quitar grupo' : 'Seleccionar grupo'}
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {groupPermissions.map((permission) => (
                  <Field key={permission.id} orientation="horizontal" className="rounded-lg border p-2.5 has-data-checked:border-primary/40 has-data-checked:bg-primary/5">
                    <Checkbox id={`permission-${permission.id}`} checked={value.includes(permission.id)} onCheckedChange={(checked) => toggle(permission.id, checked)} disabled={disabled} />
                    <FieldLabel htmlFor={`permission-${permission.id}`} className="cursor-pointer text-xs">{permission.name.split(':')[1] ?? permission.name}</FieldLabel>
                  </Field>
                ))}
              </div>
            </section>
          ))}
          {Object.keys(groups).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No se encontraron permisos.</p>}
        </div>
      </ScrollArea>
    </div>
  )
}
