/** Mock solo si VITE_USE_MOCK_API=true (prod/Vercel: false o omitir → API real). */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

export function mockResponse(data, delay = 500) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}
