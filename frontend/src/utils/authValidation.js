const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin({ email, password }) {
  const errors = {}

  if (!email?.trim()) {
    errors.email = 'required'
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = 'invalidEmail'
  }

  if (!password) {
    errors.password = 'required'
  }

  return errors
}

export function validateRegister({ name, email, password }) {
  const errors = {}

  if (!name?.trim()) {
    errors.name = 'required'
  }

  if (!email?.trim()) {
    errors.email = 'required'
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = 'invalidEmail'
  }

  if (!password) {
    errors.password = 'required'
  } else if (password.length < 8) {
    errors.password = 'passwordMin'
  }

  return errors
}
