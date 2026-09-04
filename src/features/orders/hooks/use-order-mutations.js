import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersClient } from '@/features/orders/api/orders-api'
export const orderKeys = Object.freeze({ all: ['orders'] })
export function useCreateOrder() { const queryClient = useQueryClient(); return useMutation({ mutationFn: (values) => ordersClient.create(values), onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: orderKeys.all }), queryClient.invalidateQueries({ queryKey: ['products'] })]) } }) }
