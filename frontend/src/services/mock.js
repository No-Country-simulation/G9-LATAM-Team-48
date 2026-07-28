export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

export function mockResponse(data, delay = 500) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}
