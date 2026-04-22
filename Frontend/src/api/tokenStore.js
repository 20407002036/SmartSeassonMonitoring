const TOKEN_KEY = 'smartseason.auth.tokens'

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

export function getTokens() {
  if (!canUseStorage()) {
    return { access: null, refresh: null }
  }

  try {
    const raw = window.localStorage.getItem(TOKEN_KEY)
    if (!raw) {
      return { access: null, refresh: null }
    }

    const parsed = JSON.parse(raw)
    return {
      access: parsed?.access || null,
      refresh: parsed?.refresh || null,
    }
  } catch {
    return { access: null, refresh: null }
  }
}

export function setTokens(tokens) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(TOKEN_KEY, JSON.stringify({
    access: tokens?.access || null,
    refresh: tokens?.refresh || null,
  }))
}

export function clearTokens() {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.removeItem(TOKEN_KEY)
}

export function hasAccessToken() {
  return Boolean(getTokens().access)
}
