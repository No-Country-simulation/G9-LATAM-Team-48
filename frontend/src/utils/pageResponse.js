/** Normaliza respuesta paginada del backend (o array legacy). */
export function normalizePageResponse(raw) {
  const value =
    raw && typeof raw === 'object' && 'data' in raw && raw.data !== undefined
      ? raw.data
      : raw

  if (Array.isArray(value)) {
    return {
      content: value,
      page: 0,
      size: value.length,
      totalElements: value.length,
      totalPages: value.length > 0 ? 1 : 0,
    }
  }

  if (value && Array.isArray(value.content)) {
    return {
      content: value.content,
      page: Number(value.page) || 0,
      size: Number(value.size) || value.content.length,
      totalElements: Number(value.totalElements) ?? value.content.length,
      totalPages: Number(value.totalPages) ?? 1,
    }
  }

  return {
    content: [],
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  }
}

export const PAGE_SIZE_OPTIONS = [10, 15, 25, 50]

export const DEFAULT_PAGE_SIZE = 15
