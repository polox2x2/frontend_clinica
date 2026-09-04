import { useQuery } from '@tanstack/react-query'

import { getSession } from '@/features/auth/api/auth-api'

export const authKeys = Object.freeze({
  all: ['auth'],
  session: ['auth', 'session'],
})

export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: getSession,
    staleTime: 5 * 60_000,
    retry: false,
  })
}
