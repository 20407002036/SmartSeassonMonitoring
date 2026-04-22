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

  return []
}

const AGENT_ENDPOINT_CANDIDATES = ['/users/agents/', '/users/?role=field_agent', '/users/?role=agent']

export async function listAgents() {
  for (const endpoint of AGENT_ENDPOINT_CANDIDATES) {
    try {
      const data = await apiRequest(endpoint)
      const entries = extractArrayPayload(data)
      return entries.map(toFrontendAgent)
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 405)) {
        continue
      }

      throw error
    }
  }

  return []
}
