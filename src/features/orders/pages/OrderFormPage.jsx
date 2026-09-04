import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Check, Minus, PackageX, Plus, Search, ShoppingCart, Trash2, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from '@/features/auth'
import { listPatientOptions } from '@/features/orders/api/orders-api'
import { useCreateOrder } from '@/features/orders/hooks/use-order-mutations'
import { orderRequestSchema } from '@/features/orders/schemas/order-schemas'
import { listProductOptions } from '@/features/products'
import { AppLoading } from '@/shared/components/feedback/AppLoading'

const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })

export default function OrderFormPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const canListPatients = session.permissions.includes('Patient:List')

  const products = useQuery({ queryKey: ['products', 'sale-options'], queryFn: listProductOptions })
  const patients = useQuery({ queryKey: ['patients', 'sale-options'], queryFn: listPatientOptions, enabled: canListPatients })
  const mutation = useCreateOrder()

  const [patientId, setPatientId] = useState('')
  const [cart, setCart] = useState([]) // [{ productId, quantity }]
  const [search, setSearch] = useState('')
  const [formError, setFormError] = useState('')

  const productMap = useMemo(
    () => new Map((products.data ?? []).map((product) => [product.id, product])),
    [products.data],
  )

  if (products.isPending || (canListPatients && patients.isPending)) return <AppLoading label="Preparando punto de venta" />
  const loadError = products.error ?? patients.error
  if (loadError) throw loadError

  const inCart = (id) => cart.find((line) => line.productId === id)?.quantity ?? 0
  const total = cart.reduce((sum, line) => sum + (productMap.get(line.productId)?.price ?? 0) * line.quantity, 0)
  const totalUnits = cart.reduce((sum, line) => sum + line.quantity, 0)

  const catalog = (products.data ?? []).filter((product) =>
    product.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  function addProduct(product) {
    setFormError('')
    setCart((current) => {
      const existing = current.find((line) => line.productId === product.id)
      if (!existing) return [...current, { productId: product.id, quantity: 1 }]
      if (existing.quantity >= product.stock) return current
      return current.map((line) =>
        line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line,
      )
    })
  }

  function setQuantity(productId, quantity) {
    const stock = productMap.get(productId)?.stock ?? 0
    const clamped = Math.max(1, Math.min(quantity, stock))
    setCart((current) => current.map((line) => (line.productId === productId ? { ...line, quantity: clamped } : line)))
  }

  function removeLine(productId) {
    setCart((current) => current.filter((line) => line.productId !== productId))
  }

  async function confirm() {
    setFormError('')
    const parsed = orderRequestSchema.safeParse({ patientId, items: cart })
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Revisa la venta.')
      return
    }
    const overStock = parsed.data.items.find((item) => item.quantity > (productMap.get(item.productId)?.stock ?? 0))
    if (overStock) {
      setFormError(`Stock insuficiente para ${productMap.get(overStock.productId)?.name}.`)
      return
    }
    try {
      await mutation.mutateAsync(parsed.data)
      navigate('/dashboard/ventas')
    } catch {
      /* mutation.error se muestra en el panel */
    }
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <ShoppingCart className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Punto de venta</h1>
            <p className="text-sm text-muted-foreground">Toca un producto para agregarlo; el stock se descuenta al confirmar.</p>
          </div>
        </div>
        <Button variant="ghost" className="w-fit" onClick={() => navigate('/dashboard/ventas')}>
          <ArrowLeft /> Volver a ventas
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* ---- Catálogo ---- */}
        <Card>
          <CardHeader className="gap-3">
            <CardTitle>Catálogo</CardTitle>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar producto..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {catalog.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon"><PackageX /></EmptyMedia>
                  <EmptyTitle>Sin productos</EmptyTitle>
                  <EmptyDescription>No hay productos que coincidan con la búsqueda.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {catalog.map((product) => {
                  const soldOut = product.stock <= 0
                  const maxed = inCart(product.id) >= product.stock
                  return (
                    <button
                      key={product.id}
                      type="button"
                      disabled={soldOut || maxed}
                      onClick={() => addProduct(product)}
                      className="group flex flex-col gap-2 rounded-xl border bg-card p-4 text-left transition hover:border-primary hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium leading-tight">{product.name}</span>
                        {inCart(product.id) > 0 && <Badge>{inCart(product.id)}</Badge>}
                      </div>
                      <span className="text-lg font-semibold">{money.format(product.price)}</span>
                      <Badge variant={soldOut ? 'destructive' : 'secondary'} className="w-fit">
                        {soldOut ? 'Sin stock' : `${product.stock} disp.`}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---- Carrito ---- */}
        <Card className="h-fit lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Venta</span>
              {totalUnits > 0 && <Badge variant="secondary">{totalUnits} u.</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1.5">
              <label htmlFor="patientId" className="flex items-center gap-1.5 text-sm font-medium">
                <UserRound className="size-4 text-muted-foreground" /> Cliente
              </label>
              {canListPatients ? (
                <NativeSelect id="patientId" value={patientId} onChange={(event) => setPatientId(event.target.value)}>
                  <NativeSelectOption value="">Venta directa / público general</NativeSelectOption>
                  {patients.data.map((patient) => (
                    <NativeSelectOption key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} · {patient.documentId}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              ) : (
                <p className="text-sm text-muted-foreground">Se registrará como venta directa.</p>
              )}
            </div>

            <Separator />

            {cart.length === 0 ? (
              <Empty className="py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon"><ShoppingCart /></EmptyMedia>
                  <EmptyTitle>Carrito vacío</EmptyTitle>
                  <EmptyDescription>Agrega productos desde el catálogo.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul className="grid gap-3">
                {cart.map((line) => {
                  const product = productMap.get(line.productId)
                  return (
                    <li key={line.productId} className="grid gap-2 rounded-lg border bg-muted/20 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium leading-tight">{product?.name}</span>
                        <button
                          type="button"
                          aria-label={`Quitar ${product?.name}`}
                          className="text-muted-foreground transition hover:text-destructive"
                          onClick={() => removeLine(line.productId)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border">
                          <Button
                            type="button" size="icon-sm" variant="ghost" aria-label="Restar"
                            disabled={line.quantity <= 1}
                            onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          ><Minus /></Button>
                          <span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
                          <Button
                            type="button" size="icon-sm" variant="ghost" aria-label="Sumar"
                            disabled={line.quantity >= (product?.stock ?? 0)}
                            onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          ><Plus /></Button>
                        </div>
                        <span className="text-sm font-semibold">{money.format((product?.price ?? 0) * line.quantity)}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}

            {(formError || mutation.error) && (
              <Alert variant="destructive">
                <AlertDescription>{formError || mutation.error.message}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between rounded-xl bg-primary/5 p-4">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="text-2xl font-bold">{money.format(total)}</span>
            </div>

            <Button size="lg" disabled={mutation.isPending || cart.length === 0} onClick={confirm}>
              {mutation.isPending ? <Spinner /> : <Check />}
              {mutation.isPending ? 'Registrando...' : 'Confirmar venta'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
