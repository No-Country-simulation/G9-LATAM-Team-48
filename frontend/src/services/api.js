import axios from 'axios'

// Vacío = misma origen (nginx proxea /api → backend).
// Solo en DEV sin variable usamos localhost del backend.
const envUrl = import.meta.env.VITE_API_URL
const baseURL =
  envUrl !== undefined
    ? envUrl
    : import.meta.env.DEV
      ? 'http://localhost:8080'
      : ''

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
