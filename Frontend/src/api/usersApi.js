import { ApiError, apiRequest } from './httpClient'

function toFrontendAgent(item) {
  return {
    id: String(item.id),
    role: item.role === 'field_agent' ? 'agent' : item.role,
    name: item.full_name || item.name || item.username || 'Unknown Agent',
    email: item.email || '',
  }
}

function extractArrayPayload(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.results)) {
    return data.results
  }

  if (Array.isArray(data?.items)) {
    return data.items
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  return []
}

function isAgentRole(role) {
  const normalized = String(role || '').trim().toLowerCase()
  return normalized === 'agent' || normalized === 'field_agent' || normalized === 'field-agent'
}

const AGENT_ENDPOINT_CANDIDATES = ['/agents/', '/users/agents/', '/users/?role=field_agent', '/users/?role=agent', '/users/']

export async function listAgents() {
  for (const endpoint of AGENT_ENDPOINT_CANDIDATES) {
    try {
      const data = await apiRequest(endpoint)
      const entries = extractArrayPayload(data)
      const mapped = entries.map(toFrontendAgent).filter((user) => isAgentRole(user.role))

      // Some backend variants return 200 with empty payload for unsupported filters.
      if (mapped.length === 0) {
        continue
      }

      return mapped
    } catch (error) {
      // New backend contract makes /agents/ admin-only.
      // Non-admin sessions should continue without global agent list.
      if (error instanceof ApiError && error.status === 403) {
        return []
      }

      if (error instanceof ApiError && (error.status === 404 || error.status === 405)) {
        continue
      }

      throw error
    }
  }

  return []
}
