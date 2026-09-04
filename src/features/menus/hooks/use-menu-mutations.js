import { useMutation, useQueryClient } from '@tanstack/react-query'
import { menusClient } from '@/features/menus/api/menus-api'

export const menuCrudKeys = Object.freeze({ all: ['menus'] })

function useMenuMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn, onSuccess: async () => Promise.all([
    queryClient.invalidateQueries({ queryKey: menuCrudKeys.all }),
    queryClient.invalidateQueries({ queryKey: ['navigation', 'menu-tree'] }),
  ]) })
}

export const useCreateMenu = () => useMenuMutation((values) => menusClient.create(values))
export const useUpdateMenu = (id) => useMenuMutation((values) => menusClient.update(id, values))
export const useDeleteMenu = () => useMenuMutation((id) => menusClient.remove(id))
