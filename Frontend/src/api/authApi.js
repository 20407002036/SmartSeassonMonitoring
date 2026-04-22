import { apiRequest } from './httpClient'
import { toFrontendUser } from './mappers'
import { clearTokens, getTokens, setTokens } from './tokenStore'

export async function loginUser({ username, password }) {
  const tokens = await apiRequest('/auth/login/', {
    method: 'POST',
    auth: false,
    body: {
      username: String(username || '').trim(),
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
