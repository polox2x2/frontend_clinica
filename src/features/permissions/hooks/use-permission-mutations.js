import { useMutation, useQueryClient } from '@tanstack/react-query'

import { permissionsClient } from '@/features/permissions/api/permissions-api'

export const permissionKeys = Object.freeze({ all: ['permissions'] })

function usePermissionMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: permissionKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['roles'] }),
        queryClient.invalidateQueries({ queryKey: ['auth', 'session'] }),
        queryClient.invalidateQueries({ queryKey: ['navigation', 'menu-tree'] }),
      ])
    },
  })
}

export function useCreatePermission() {
  return usePermissionMutation((values) => permissionsClient.create(values))
}

export function useUpdatePermission(id) {
  return usePermissionMutation((values) => permissionsClient.update(id, values))
}

export function useDeletePermission() {
  return usePermissionMutation((id) => permissionsClient.remove(id))
}
