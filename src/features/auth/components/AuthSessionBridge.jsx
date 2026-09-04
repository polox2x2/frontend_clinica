import { useEffect } from 'react'

import { connectWebSocket } from '@/core/websocket/stomp-client'
import { useSession } from '@/features/auth/hooks/use-session'

export function AuthSessionBridge() {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) return undefined

    const disconnect = connectWebSocket()
    return () => { void disconnect() }
  }, [session])

  return null
}
