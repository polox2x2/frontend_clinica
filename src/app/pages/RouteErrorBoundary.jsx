import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function RouteErrorBoundary() {
  const error = useRouteError()
  const title = isRouteErrorResponse(error) ? `Error ${error.status}` : 'Ocurrio un error inesperado'
  const description = isRouteErrorResponse(error)
    ? error.statusText
    : 'No pudimos mostrar esta pagina. Intenta cargarla nuevamente.'

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      <Button onClick={() => window.location.reload()}>Reintentar</Button>
    </main>
  )
}
