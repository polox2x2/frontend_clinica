import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">Error 404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Pagina no encontrada</h1>
      <Button render={<Link to="/" />}>Volver al inicio</Button>
    </main>
  )
}
