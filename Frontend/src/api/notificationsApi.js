import { apiRequest } from './httpClient'

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
  const data = await apiRequest('/notifications/')
  return Array.isArray(data) ? data.map(toFrontendNotification) : []
}

export async function markNotificationAsRead(notificationId) {
  const data = await apiRequest(`/notifications/${notificationId}/read/`, {
    method: 'PUT',
  })
  return toFrontendNotification(data)
}
