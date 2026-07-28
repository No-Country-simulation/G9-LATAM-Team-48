export function deepMerge(base, patch) {
  if (patch === null || patch === undefined) return base
  if (Array.isArray(base) || Array.isArray(patch)) return patch
  if (typeof base !== 'object' || base === null) return patch
  if (typeof patch !== 'object' || patch === null) return patch

  const out = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      out[key] = deepMerge(base[key], value)
    } else {
      out[key] = value
    }
  }
  return out
}
