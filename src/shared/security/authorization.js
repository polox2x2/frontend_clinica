const toSet = (values) => values instanceof Set ? values : new Set(values ?? [])

export function hasPermission(session, permission) {
  if (!permission) return true
  return toSet(session?.permissions).has(permission)
}

export function hasAnyPermission(session, permissions) {
  return permissions.some((permission) => hasPermission(session, permission))
}

export function hasAllPermissions(session, permissions) {
  return permissions.every((permission) => hasPermission(session, permission))
}

export function hasRole(session, role) {
  if (!role) return true
  return toSet(session?.roles).has(role)
}
