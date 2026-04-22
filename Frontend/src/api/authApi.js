import { apiRequest } from './httpClient'
import { toFrontendUser } from './mappers'
import { clearTokens, getTokens, setTokens } from './tokenStore'

function extractUsername(identifier) {
  if (!identifier) {
    return ''
  }

  const value = String(identifier).trim()
  return value.includes('@') ? value.split('@')[0] : value
}

export async function loginUser({ identifier, password }) {
  const tokens = await apiRequest('/auth/login/', {
    method: 'POST',
    auth: false,
    body: {
      username: extractUsername(identifier),
      password,
    },
  })

  setTokens(tokens)
  return tokens
}

export async function getCurrentUser() {
  const data = await apiRequest('/auth/me/')
  return toFrontendUser(data)
}

export async function logoutUser() {
  const { refresh } = getTokens()

  if (refresh) {
    try {
      await apiRequest('/auth/logout/', {
        method: 'POST',
        body: { refresh },
      })
    } catch {
      // Local token cleanup should still happen even if backend logout fails.
    }
  }

  clearTokens()
}
