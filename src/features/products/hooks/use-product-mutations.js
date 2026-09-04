import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productsClient } from '@/features/products/api/products-api'

export const productKeys = Object.freeze({ all: ['products'] })
function useProductMutation(mutationFn) { const queryClient = useQueryClient(); return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }) }) }
export const useCreateProduct = () => useProductMutation((values) => productsClient.create(values))
export const useUpdateProduct = (id) => useProductMutation((values) => productsClient.update(id, values))
export const useDeleteProduct = () => useProductMutation((id) => productsClient.remove(id))
