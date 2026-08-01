import api from './api'
import { DEFAULT_PAGE_SIZE, normalizePageResponse } from '../utils/pageResponse'

function unwrap(payload) {
  return payload?.data ?? payload
}

export async function listUsers({ page = 0, size = DEFAULT_PAGE_SIZE } = {}) {
  const { data } = await api.get('/api/v1/admin/users', {
    params: { page, size },
  })
  return normalizePageResponse(data)
}

export async function createUser(user) {
  const body = {
    name: user.name.trim(),
    email: user.email.trim(),
    role: user.role,
    emailVerified: user.emailVerified !== false,
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
    emailVerified: Boolean(user.emailVerified),
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
