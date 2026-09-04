import { useMutation, useQueryClient } from '@tanstack/react-query'

import { login, logout, register } from '@/features/auth/api/auth-api'
import { authKeys } from '@/features/auth/hooks/use-session'

function useSessionMutation(mutationFn) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (session) => queryClient.setQueryData(authKeys.session, session),
  })
}

export function useLogin() {
  return useSessionMutation(login)
}

export function useRegister() {
  return useSessionMutation(register)
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
    // Redireccion "dura" a /login (onSettled: corre aunque el POST /logout falle).
    // Es intencional NO usar setQueryData(session, null): eso re-renderizaria las
    // paginas del dashboard aun montadas, que leen session.roles/permissions sin
    // optional chaining y truenan. El full-reload descarta todo el arbol de una y,
    // como el backend ya limpio la cookie, la nueva carga arranca sin sesion.
    onSettled: () => {
      window.location.assign('/login')
    },
  })
}
