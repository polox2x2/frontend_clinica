import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function FormField({ error, icon: Icon, label, name, type, ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const errorId = `${name}-error`
  const isPassword = type === 'password'

  return (
    <Field className="gap-2" data-invalid={Boolean(error)}>
      <FieldLabel className="text-sm font-medium text-slate-700" htmlFor={name}>{label}</FieldLabel>
      <div className="relative">
        {Icon && <Icon aria-hidden="true" className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />}
        <Input
          className={`h-12 rounded-xl border-slate-200 bg-white shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-600/10 ${Icon ? 'pl-11' : ''} ${isPassword ? 'pr-11' : ''}`}
          id={name}
          name={name}
          type={isPassword && showPassword ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {isPassword && (
          <button
            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        )}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  )
}
