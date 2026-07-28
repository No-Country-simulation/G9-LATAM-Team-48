import { DEMO_CREDENTIALS } from '../data/demoCredentials'
import { formatDisplayName } from '../utils/formatDisplayName'

const STORAGE_KEY = 'energyai_mock_users'

function seedUsers() {
  return DEMO_CREDENTIALS.map((cred, index) => ({
    id: index + 1,
    nombre: formatDisplayName(cred.email.split('@')[0]),
    email: cred.email.toLowerCase(),
    password: cred.password,
    rol: cred.roleKey === 'admin' ? 'ADMIN' : 'USER',
  }))
}

function normalizeDemoRoles(users) {
  return users.map((user) =>
    user.email === 'admin@energyai.com'
      ? { ...user, rol: 'ADMIN' }
      : { ...user, rol: user.rol === 'operador' ? 'USER' : user.rol },
  )
}

function readUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedUsers()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    const normalized = normalizeDemoRoles(JSON.parse(raw))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    return normalized
  } catch {
    const seeded = seedUsers()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }
}

function writeUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function toSession(user) {
  return {
    token: `mock-token-${user.id}-${Date.now()}`,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
  }
}

export async function mockLogin({ email, password }) {
  await delay()

  const normalized = email?.trim().toLowerCase()
  if (!normalized || !password) {
    throw new Error('loginFailed')
  }

  const users = readUsers()
  const user = users.find((item) => item.email === normalized)

  if (!user || user.password !== password) {
    throw new Error('loginFailed')
  }

  return toSession(user)
}

export async function mockRegister({ name, email, password }) {
  await delay()

  const normalized = email.trim().toLowerCase()
  const users = readUsers()

  if (users.some((item) => item.email === normalized)) {
    throw new Error('registerFailed')
  }

  const user = {
    id: users.length + 1,
    nombre: name.trim() || formatDisplayName(normalized.split('@')[0]),
    email: normalized,
    password,
    rol: 'operador',
  }

  users.push(user)
  writeUsers(users)

  return toSession(user)
}
