import api from './api'

function unwrap(payload) {
  return payload?.data ?? payload
}

function asUserList(payload) {
  const value = unwrap(payload)
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.content)) return value.content
  if (Array.isArray(value?.users)) return value.users
  return []
}

export async function listUsers() {
  const { data } = await api.get('/api/v1/admin/users')
  return asUserList(data)
}

export async function createUser(user) {
  const body = {
    name: user.name.trim(),
    email: user.email.trim(),
    role: user.role,
  }
  if (user.password?.trim()) {
    body.password = user.password
  }
  const { data } = await api.post('/api/v1/admin/users', body)
  return unwrap(data)
}

export async function updateUser(id, user) {
  const body = {
    name: user.name.trim(),
    email: user.email.trim(),
    role: user.role,
  }
  if (user.password?.trim()) {
    body.password = user.password
  }
  const { data } = await api.put(`/api/v1/admin/users/${id}`, body)
  return unwrap(data)
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/api/v1/admin/users/${id}`)
  return unwrap(data)
}
