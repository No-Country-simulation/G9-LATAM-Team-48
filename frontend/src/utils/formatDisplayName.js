export function formatDisplayName(value) {
  if (!value) {
    return ''
  }

  const trimmed = value.trim()

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}
