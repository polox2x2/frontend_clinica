import { ZodError } from 'zod'

export function zodFieldErrors(error) {
  if (!(error instanceof ZodError)) return {}

  return Object.fromEntries(
    error.issues
      .filter((issue) => issue.path.length > 0)
      .map((issue) => [issue.path[0], issue.message]),
  )
}

export function apiFieldErrors(error) {
  const details = error?.details
  if (!details || Array.isArray(details) || typeof details !== 'object') return {}

  return Object.fromEntries(
    Object.entries(details).filter(([, message]) => typeof message === 'string'),
  )
}
