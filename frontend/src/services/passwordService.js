import api from './api'

function unwrap(payload) {
  return payload?.data ?? payload
}

export async function forgotPassword(email) {
  const { data } = await api.post('/api/v1/auth/forgot-password', {
    email: email.trim(),
  })
  return unwrap(data)
}

export async function resetPassword(token, newPassword) {
  const { data } = await api.post('/api/v1/auth/reset-password', {
    token,
    newPassword,
  })
  return unwrap(data)
}

export async function verifyEmail(token) {
  const { data } = await api.post('/api/v1/auth/verify-email', {
    token,
  })
  return unwrap(data)
}

export async function resendVerification(email) {
  const { data } = await api.post('/api/v1/auth/resend-verification', {
    email: email.trim(),
  })
  return unwrap(data)
}
