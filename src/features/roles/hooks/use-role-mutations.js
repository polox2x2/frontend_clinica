import { useMutation, useQueryClient } from '@tanstack/react-query'

import { rolesClient } from '@/features/roles/api/roles-api'

export const roleKeys = Object.freeze({ all: ['roles'] })

function useRoleMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roleKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['auth', 'session'] }),
        queryClient.invalidateQueries({ queryKey: ['navigation', 'menu-tree'] }),
      ])
    },
  })
}

export function useCreateRole() {
  return useRoleMutation((values) => rolesClient.create(values))
}

export function useUpdateRole(id) {
  return useRoleMutation((values) => rolesClient.update(id, values))
}

export function useDeleteRole() {
  return useRoleMutation((id) => rolesClient.remove(id))
}
