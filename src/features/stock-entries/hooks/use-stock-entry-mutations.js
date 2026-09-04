import { useMutation, useQueryClient } from '@tanstack/react-query'
import { stockEntriesClient } from '@/features/stock-entries/api/stock-entries-api'
export const stockEntryKeys = Object.freeze({ all: ['stock-entries'] })
export function useCreateStockEntry() { const queryClient = useQueryClient(); return useMutation({ mutationFn: (values) => stockEntriesClient.create(values), onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: stockEntryKeys.all }), queryClient.invalidateQueries({ queryKey: ['products'] })]) } }) }
