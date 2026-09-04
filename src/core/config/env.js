import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:8080/api'),
  VITE_WS_URL: z.string().url().optional(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('Configuración de entorno inválida', parsed.error.flatten().fieldErrors)
  throw new Error('La configuración del frontend es inválida')
}

const apiUrl = parsed.data.VITE_API_URL.replace(/\/$/, '')

function inferWebSocketUrl() {
  const backendUrl = new URL(apiUrl)
  backendUrl.protocol = backendUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  backendUrl.pathname = backendUrl.pathname.replace(/\/api\/?$/, '/ws')
  backendUrl.search = ''
  backendUrl.hash = ''
  return backendUrl.toString()
}

export const env = Object.freeze({
  apiUrl,
  webSocketUrl: parsed.data.VITE_WS_URL ?? inferWebSocketUrl(),
})
