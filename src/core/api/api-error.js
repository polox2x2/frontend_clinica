export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message, { cause: options.cause })
    this.name = 'ApiError'
    this.status = options.status ?? null
    this.code = options.code ?? null
    this.details = options.details ?? null
  }
}
