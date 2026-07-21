import api from './api'

function unwrap(payload) {
  return payload?.data ?? payload
}

export async function listAnalisis() {
  const { data } = await api.get('/api/v1/admin/analisis')
  const value = unwrap(data)
  return Array.isArray(value) ? value : []
}
