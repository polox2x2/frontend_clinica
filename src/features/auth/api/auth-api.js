import { httpClient } from '@/core/api/http-client'
import { loginSchema, registerSchema, sessionSchema } from '@/features/auth/schemas/auth-schemas'

export async function getSession() {
  try {
    const { data } = await httpClient.get('/auth/me')
    return sessionSchema.parse(data)
  } catch (error) {
    if (error?.status === 401 || error?.status === 403) return null
    throw error
  }
}

export async function login(credentials) {
  const body = loginSchema.parse(credentials)
  const { data } = await httpClient.post('/auth/login', body)
  return sessionSchema.parse(data)
}

export async function register(account) {
  const body = registerSchema.parse(account)
  const { data } = await httpClient.post('/auth/register', body)
  return sessionSchema.parse(data)
}

export async function logout() {
  await httpClient.post('/auth/logout')
}
