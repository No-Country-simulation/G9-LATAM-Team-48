import api from './api'

export async function getRecomendaciones() {
  const { data } = await api.get('/api/recomendaciones', { timeout: 12_000 })
  return data
}
