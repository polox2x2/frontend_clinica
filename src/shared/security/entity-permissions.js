export function entityPermission(prefix, action) {
  return prefix ? `${prefix}:${action}` : null
}

export function canPerform(permissions, prefix, action) {
  if (!prefix) return true
  const values = permissions instanceof Set ? permissions : new Set(permissions ?? [])
  return values.has(entityPermission(prefix, action))
}
