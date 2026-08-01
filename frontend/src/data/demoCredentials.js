function demoPassword(envKey) {
  const value = import.meta.env[envKey]
  return typeof value === 'string' ? value.trim() : ''
}

function demoAccount(roleKey, email, envKey) {
  const password = demoPassword(envKey)
  if (!password) return null
  return { roleKey, email, password }
}

/** Solo para VITE_USE_MOCK_AUTH=true — contraseñas vía .env.local, no en Git. */
export const DEMO_CREDENTIALS = [
  demoAccount('operator', 'operador@energyai.com', 'VITE_DEMO_OPERADOR_PASSWORD'),
  demoAccount('admin', 'admin@energyai.com', 'VITE_DEMO_ADMIN_PASSWORD'),
  demoAccount('team', 'team48@energyai.com', 'VITE_DEMO_TEAM_PASSWORD'),
].filter(Boolean)
