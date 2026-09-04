import { Client } from '@stomp/stompjs'

import { env } from '@/core/config/env'

const subscriptionDefinitions = new Map()
let connectionConsumers = 0
let pendingDisconnect = null

function attachSubscription(definition) {
  definition.subscription = stompClient.subscribe(definition.destination, (message) => {
    const payload = message.body ? JSON.parse(message.body) : null
    definition.listener(payload, message)
  }, definition.headers)
}

export const stompClient = new Client({
  brokerURL: env.webSocketUrl,
  reconnectDelay: 5_000,
  heartbeatIncoming: 10_000,
  heartbeatOutgoing: 10_000,
  connectionTimeout: 10_000,
  debug: import.meta.env.DEV ? (message) => console.debug('[STOMP]', message) : undefined,
  onWebSocketClose: () => {
    subscriptionDefinitions.forEach((definition) => {
      definition.subscription = null
    })
  },
})

export function connectWebSocket(callbacks = {}) {
  connectionConsumers += 1
  if (pendingDisconnect) {
    clearTimeout(pendingDisconnect)
    pendingDisconnect = null
  }

  stompClient.onConnect = (frame) => {
    subscriptionDefinitions.forEach(attachSubscription)
    callbacks.onConnect?.(frame)
  }
  stompClient.onStompError = (frame) => callbacks.onError?.(frame)
  stompClient.onWebSocketError = (event) => callbacks.onError?.(event)
  if (!stompClient.active) stompClient.activate()

  let released = false
  return () => {
    if (released) return
    released = true
    connectionConsumers = Math.max(0, connectionConsumers - 1)
    if (connectionConsumers > 0) return

    // Evita apagar la conexion durante el doble montaje de efectos de StrictMode.
    pendingDisconnect = setTimeout(() => {
      pendingDisconnect = null
      if (connectionConsumers === 0) void disconnectWebSocket()
    }, 0)
  }
}

export async function disconnectWebSocket() {
  subscriptionDefinitions.forEach((definition) => definition.subscription?.unsubscribe())
  subscriptionDefinitions.clear()
  await stompClient.deactivate()
}

export function subscribe(destination, listener, headers = {}) {
  const id = crypto.randomUUID()
  const definition = { destination, listener, headers, subscription: null }
  subscriptionDefinitions.set(id, definition)
  if (stompClient.connected) attachSubscription(definition)

  return () => {
    definition.subscription?.unsubscribe()
    subscriptionDefinitions.delete(id)
  }
}

export function publish(destination, body, headers = {}) {
  if (!stompClient.connected) throw new Error('El WebSocket todavía no está conectado')
  stompClient.publish({ destination, body: JSON.stringify(body), headers })
}

export const websocketDestinations = Object.freeze({
  appointments: '/user/queue/appointments',
  doctorCalendar: (doctorId) => `/topic/calendar/doctor/${doctorId}`,
})
