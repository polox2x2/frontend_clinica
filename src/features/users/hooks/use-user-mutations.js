import { useMutation, useQueryClient } from '@tanstack/react-query'

import { usersClient } from '@/features/users/api/users-api'

export const userKeys = Object.freeze({ all: ['users'] })

function useUserMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['auth', 'session'] }),
        queryClient.invalidateQueries({ queryKey: ['navigation', 'menu-tree'] }),
      ])
    },
  })
}

export function useCreateUser() {
  return useUserMutation((values) => usersClient.create(values))
}

export function useUpdateUser(id) {
  return useUserMutation((values) => usersClient.update(id, values))
}

export function useDeleteUser() {
  return useUserMutation((id) => usersClient.remove(id))
}
