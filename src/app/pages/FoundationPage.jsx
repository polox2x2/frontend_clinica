import { LayoutDashboard } from 'lucide-react'

import { useSession } from '@/features/auth'

export default function FoundationPage() {
  const { data: session } = useSession()

  return (
    <section className="grid min-h-[60vh] place-items-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <LayoutDashboard className="size-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Bienvenido, {session?.firstName}</h1>
        <p className="mt-2 text-muted-foreground">Selecciona una opción del menú lateral para comenzar a gestionar la clínica.</p>
      </div>
    </section>
  )
}
