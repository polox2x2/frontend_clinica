import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'

export function RoleSelector({ roles, value = [], setValue, disabled }) {
  function toggle(roleId, checked) {
    setValue(checked ? [...new Set([...value, roleId])] : value.filter((id) => id !== roleId))
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {roles.map((role) => (
        <Field key={role.id} orientation="horizontal" className="rounded-lg border p-3 transition-colors has-data-checked:border-primary/40 has-data-checked:bg-primary/5">
          <Checkbox id={`role-${role.id}`} checked={value.includes(role.id)} onCheckedChange={(checked) => toggle(role.id, checked)} disabled={disabled} />
          <FieldLabel htmlFor={`role-${role.id}`} className="grid cursor-pointer gap-0.5">
            <span>{role.name}</span>
            {role.description && <span className="text-xs font-normal text-muted-foreground">{role.description}</span>}
          </FieldLabel>
        </Field>
      ))}
    </div>
  )
}
