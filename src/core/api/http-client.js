import axios from 'axios'

import { env } from '@/core/config/env'
import { ApiError } from './api-error'

export const httpClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  withCredentials: true,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error)

    const response = error.response
    const payload = response?.data
    const message = payload?.message ?? payload?.error ??
      (error.code === 'ECONNABORTED' ? 'La solicitud tardó demasiado tiempo' : 'No se pudo completar la solicitud')

    return Promise.reject(new ApiError(message, {
      cause: error,
      status: response?.status,
      code: payload?.code ?? error.code,
      details: payload,
    }))
  },
)
