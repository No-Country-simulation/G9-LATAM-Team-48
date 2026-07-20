export function isAdmin(user) {
  if (!user) return false
  const role = String(user.rol || user.role || '').toUpperCase()
  return role === 'ADMIN' || role === 'ADMINISTRADOR'
}
