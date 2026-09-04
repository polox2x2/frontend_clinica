import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleAlert, UserPlus } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { AuthFormLayout } from '@/features/auth/components/AuthFormLayout'
import { FormField } from '@/features/auth/components/FormField'
import { useRegister } from '@/features/auth/hooks/use-auth-mutations'
import { apiFieldErrors, zodFieldErrors } from '@/features/auth/lib/form-errors'
import { registerSchema } from '@/features/auth/schemas/auth-schemas'

export default function RegisterPage() {
  const navigate = useNavigate()
  const mutation = useRegister()
  const [fieldErrors, setFieldErrors] = useState({})

  async function handleSubmit(event) {
    event.preventDefault()
    mutation.reset()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const parsed = registerSchema.safeParse(values)

    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error))
      return
    }

    setFieldErrors({})
    try {
      await mutation.mutateAsync(parsed.data)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFieldErrors(apiFieldErrors(error))
    }
  }

  return (
    <AuthFormLayout
      title="Crear una cuenta"
      description="Tu usuario se generará automáticamente al completar el registro."
      footerText="¿Ya tienes una cuenta?"
      footerLink="/login"
      footerLabel="Inicia sesión"
    >
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        {mutation.error && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nombre" name="firstName" autoComplete="given-name" autoFocus error={fieldErrors.firstName} disabled={mutation.isPending} />
          <FormField label="Apellido" name="lastName" autoComplete="family-name" error={fieldErrors.lastName} disabled={mutation.isPending} />
        </div>
        <FormField label="Correo" name="email" type="email" autoComplete="email" error={fieldErrors.email} disabled={mutation.isPending} />
        <FormField label="Contraseña" name="password" type="password" autoComplete="new-password" error={fieldErrors.password} disabled={mutation.isPending} />
        <Button className="w-full" size="lg" type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Spinner />}
          {!mutation.isPending && <UserPlus />}
          {mutation.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthFormLayout>
  )
}
