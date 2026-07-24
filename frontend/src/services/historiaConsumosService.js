import api from './api'

function unwrap(payload) {
  return payload?.data ?? payload
}

export async function listMisAnalisis() {
  const { data } = await api.get('/api/analisis/mis')
  const value = unwrap(data)
  return Array.isArray(value) ? value : []
}

export async function reenviarEmailAnalisis(consultaId) {
  const { data } = await api.post(`/api/analisis/mis/${consultaId}/reenviar-email`)
  return unwrap(data)
}
