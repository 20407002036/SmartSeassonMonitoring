import { API_BASE_URL } from './config'
import { clearTokens, getTokens, setTokens } from './tokenStore'

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function parseResponseBody(response) {
  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function refreshAccessToken() {
  const { refresh } = getTokens()

  if (!refresh) {
    clearTokens()
    throw new ApiError('Session expired. Please sign in again.', 401, null)
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  })

  const data = await parseResponseBody(response)
  if (!response.ok || !data?.access) {
    clearTokens()
    throw new ApiError('Session expired. Please sign in again.', response.status, data)
  }

  setTokens({
    access: data.access,
    refresh,
  })

  return data.access
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    auth = true,
    retryOn401 = true,
    headers: providedHeaders,
  } = options

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${API_BASE_URL}${normalizedPath}`
  const tokens = getTokens()
  const headers = {
    'Content-Type': 'application/json',
    ...(providedHeaders || {}),
  }

  if (auth && tokens.access) {
    headers.Authorization = `Bearer ${tokens.access}`
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const data = await parseResponseBody(response)

  if (response.status === 401 && auth && retryOn401) {
    const newAccess = await refreshAccessToken()
    return apiRequest(path, {
      ...options,
      retryOn401: false,
      headers: {
        ...(providedHeaders || {}),
        Authorization: `Bearer ${newAccess}`,
      },
    })
  }

  if (!response.ok) {
    const message =
      (typeof data === 'object' && data?.detail) ||
      (typeof data === 'string' ? data : 'Request failed.')
    throw new ApiError(message, response.status, data)
  }

  return data
}
