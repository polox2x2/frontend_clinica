import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">Error 403</p>
      <h1 className="text-3xl font-semibold tracking-tight">No tienes acceso</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Tu cuenta no posee el permiso requerido para acceder a esta sección.
      </p>
      <Button render={<Link to="/dashboard" />}>Volver al panel</Button>
    </main>
  )
}
