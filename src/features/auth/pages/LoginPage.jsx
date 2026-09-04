import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CircleAlert, LockKeyhole, UserRound } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { AuthFormLayout } from '@/features/auth/components/AuthFormLayout'
import { FormField } from '@/features/auth/components/FormField'
import { useLogin } from '@/features/auth/hooks/use-auth-mutations'
import { apiFieldErrors, zodFieldErrors } from '@/features/auth/lib/form-errors'
import { loginSchema } from '@/features/auth/schemas/auth-schemas'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const mutation = useLogin()
  const [fieldErrors, setFieldErrors] = useState({})

  async function handleSubmit(event) {
    event.preventDefault()
    mutation.reset()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error))
      return
    }

    setFieldErrors({})
    try {
      await mutation.mutateAsync(parsed.data)
      navigate(location.state?.from ?? '/dashboard', { replace: true })
    } catch (error) {
      setFieldErrors(apiFieldErrors(error))
    }
  }

  return (
    <AuthFormLayout
      title="Iniciar sesión"
      description="Ingresa con las credenciales de tu cuenta."
      footerText="¿Aún no tienes una cuenta?"
      footerLink="/registro"
      footerLabel="Regístrate"
    >
      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        {mutation.error && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        )}
        <FormField icon={UserRound} label="Usuario" name="username" placeholder="Ingresa tu usuario" autoComplete="username" autoFocus error={fieldErrors.username} disabled={mutation.isPending} />
        <FormField icon={LockKeyhole} label="Contraseña" name="password" type="password" placeholder="Ingresa tu contraseña" autoComplete="current-password" error={fieldErrors.password} disabled={mutation.isPending} />
        <Button className="mt-1 h-12 w-full rounded-xl bg-[#087a55] text-[15px] shadow-lg shadow-emerald-900/15 hover:bg-[#076b4b]" size="lg" type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Spinner />}
          {mutation.isPending ? 'Ingresando...' : 'Ingresar'}
          {!mutation.isPending && <ArrowRight className="ml-1" />}
        </Button>
      </form>
    </AuthFormLayout>
  )
}
