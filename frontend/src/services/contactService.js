import api from './api'

export async function sendContactMessage({ name, email, message }) {
  const { data } = await api.post('/api/v1/contact', {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  })
  return data?.data ?? data
}
