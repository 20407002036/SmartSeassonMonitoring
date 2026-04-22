import { apiRequest, ApiError } from './httpClient'

function toFrontendNotification(item) {
  return {
    id: String(item.id),
    fieldName: item.field?.name || 'Unknown field',
    newStatus: item.new_status,
    isUnread: item.is_unread,
    createdAt: item.created_at,
    readAt: item.read_at,
    raw: item,
  }
}

export async function listNotifications() {
  try {
    const data = await apiRequest('/notifications/')
    return Array.isArray(data) ? data.map(toFrontendNotification) : []
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) {
      throw error
    }

    // Temporary fallback for environments still exposing notifications at root path.
    const fallbackData = await apiRequest('/')
    return Array.isArray(fallbackData) ? fallbackData.map(toFrontendNotification) : []
  }
}

export async function markNotificationAsRead(notificationId) {
  const data = await apiRequest(`/${notificationId}/read/`, {
    method: 'PUT',
  })
  return toFrontendNotification(data)
}
