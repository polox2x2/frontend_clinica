import { Skeleton } from '@/components/ui/skeleton'

/**
 * Loader de carga basado en skeletons (mismo esqueleto que un formulario centrado):
 * cabecera con icono + titulo, campos en dos columnas y botones de accion.
 */
export function AppLoading({ label = 'Cargando' }) {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 py-4" role="status" aria-busy="true" aria-label={label}>
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="size-14 rounded-2xl" />
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}
