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
    if (!Array.isArray(fallbackData)) {
      return []
    }

    const notificationLike = fallbackData.filter((item) => item && Object.prototype.hasOwnProperty.call(item, 'is_unread'))
    return notificationLike.map(toFrontendNotification)
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    const data = await apiRequest(`/notifications/${notificationId}/read/`, {
      method: 'PUT',
    })
    return toFrontendNotification(data)
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) {
      throw error
    }

    const fallbackData = await apiRequest(`/${notificationId}/read/`, {
      method: 'PUT',
    })
    return toFrontendNotification(fallbackData)
  }
}
