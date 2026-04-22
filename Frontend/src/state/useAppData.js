import { useCallback, useEffect, useMemo, useState } from 'react'
import { initialFields, initialRecentUpdates, users } from '../data/mockData'
import {
  API_ENABLED,
  assignField,
  createField,
  createFieldNote,
  getCurrentUser,
  hasAccessToken,
  listAgents,
  listFields,
  listNotifications,
  loginUser,
  logoutUser as apiLogoutUser,
  markNotificationAsRead,
  updateFieldStage,
} from '../api'

const stageToStatus = {
  Harvested: 'Completed',
  Ready: 'Active',
  Growing: 'Active',
  Planted: 'At Risk',
}

function getFieldStatusFromStage(stage) {
  return stageToStatus[stage] || 'Active'
}

export function useAppData() {
  const [currentUser, setCurrentUser] = useState(null)
  const [fields, setFields] = useState(initialFields)
  const [recentUpdates, setRecentUpdates] = useState(initialRecentUpdates)
  const [activePage, setActivePage] = useState('dashboard')
  const [loginError, setLoginError] = useState('')
  const [selectedFieldId, setSelectedFieldId] = useState(initialFields[0]?.id || null)
  const [updateFieldId, setUpdateFieldId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [apiAgents, setApiAgents] = useState([])
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [notificationsError, setNotificationsError] = useState('')

  const addToast = useCallback((message) => {
    const id = crypto.randomUUID()
    setToasts((previous) => [...previous, { id, message }])
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id))
    }, 3800)
  }, [])

  const dismissToast = (id) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id))
  }

  const derivedAgents = useMemo(() => {
    const fromFields = fields.reduce((accumulator, field) => {
      if (!field.assignedAgent) {
        return accumulator
      }

      accumulator[field.assignedAgent.id] = {
        id: field.assignedAgent.id,
        role: 'agent',
        name: field.assignedAgent.name,
        email: field.assignedAgent.email,
      }
      return accumulator
    }, {})

    return Object.values(fromFields)
  }, [fields])

  const agents = useMemo(() => {
    if (!API_ENABLED) {
      return users.filter((user) => user.role === 'agent')
    }

    return apiAgents.length ? apiAgents : derivedAgents
  }, [apiAgents, derivedAgents])

  const agentsById = useMemo(() => {
    return agents.reduce((accumulator, user) => {
      accumulator[user.id] = user
      return accumulator
    }, {})
  }, [agents])

  const selectedField = fields.find((field) => field.id === selectedFieldId) || null
  const modalField = fields.find((field) => field.id === updateFieldId) || null

  const unreadCount = useMemo(() => notifications.filter((item) => item.isUnread).length, [notifications])

  const refreshNotifications = useCallback(async () => {
    if (!API_ENABLED || !currentUser) {
      return
    }

    try {
      setNotificationsLoading(true)
      setNotificationsError('')
      const items = await listNotifications()
      setNotifications(items)
    } catch (error) {
      setNotificationsError(error?.message || 'Unable to load notifications right now.')
    } finally {
      setNotificationsLoading(false)
    }
  }, [currentUser])

  const markOneNotificationRead = useCallback(async (notificationId) => {
    if (!API_ENABLED) {
      return
    }

    try {
      const updated = await markNotificationAsRead(notificationId)
      setNotifications((previous) =>
        previous.map((item) => (item.id === notificationId ? { ...item, ...updated, isUnread: false } : item)),
      )
    } catch (error) {
      addToast(error?.message || 'Unable to mark notification as read.')
    }
  }, [addToast])

  useEffect(() => {
    if (!API_ENABLED || !hasAccessToken()) {
      return
    }

    let isMounted = true

    async function bootstrapSession() {
      try {
        const [user, apiFields] = await Promise.all([getCurrentUser(), listFields()])
        const agentsList = user.role === 'admin' ? await listAgents().catch(() => []) : []
        if (!isMounted) {
          return
        }

        setCurrentUser(user)
        setFields(apiFields)
        setApiAgents(agentsList)
        setSelectedFieldId(apiFields[0]?.id || null)
      } catch {
        if (!isMounted) {
          return
        }

        setCurrentUser(null)
      }
    }

    bootstrapSession()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!API_ENABLED || !currentUser) {
      return
    }

    const timerId = window.setTimeout(() => {
      refreshNotifications()
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [currentUser, refreshNotifications])

  useEffect(() => {
    if (!API_ENABLED || !currentUser) {
      return
    }

    const pollId = window.setInterval(() => {
      refreshNotifications()
    }, 60000)

    return () => {
      window.clearInterval(pollId)
    }
  }, [currentUser, refreshNotifications])

  const handleLogin = async ({ username, password }) => {
    if (API_ENABLED) {
      try {
        await loginUser({
          username,
          password,
        })

        const [user, apiFields] = await Promise.all([getCurrentUser(), listFields()])
        const agentsList = user.role === 'admin' ? await listAgents().catch(() => []) : []

        setLoginError('')
        setCurrentUser(user)
        setFields(apiFields)
        setApiAgents(agentsList)
        setSelectedFieldId(apiFields[0]?.id || null)
        setActivePage('dashboard')
        addToast(`Signed in as ${user.name}`)
      } catch (error) {
        setLoginError(error?.message || 'Unable to sign in. Please verify credentials and backend availability.')
      }

      return
    }

    const normalizedUsername = username.toLowerCase()
    const matched = users.find((user) => user.username.toLowerCase() === normalizedUsername && user.password === password)

    if (!matched) {
      setLoginError('Invalid credentials. Use the demo accounts shown below the heading.')
      return
    }

    setLoginError('')
    setCurrentUser(matched)
    setActivePage('dashboard')
    addToast(`Signed in as ${matched.name}`)
  }

  const handleLogout = async () => {
    if (API_ENABLED) {
      await apiLogoutUser()
    }

    setCurrentUser(null)
    setApiAgents([])
    setNotifications([])
    setNotificationsError('')
    setActivePage('dashboard')
    setLoginError('')
  }

  const handleAssignAgent = async (fieldId, agentId) => {
    if (API_ENABLED) {
      try {
        const updatedField = await assignField(fieldId, agentId || null)

        setFields((previous) =>
          previous.map((field) => (field.id === fieldId ? { ...field, ...updatedField } : field)),
        )

        const agentName = agentsById[agentId]?.name || 'Unassigned'
        const target = fields.find((field) => field.id === fieldId)
        if (target) {
          addToast(`${target.name} assigned to ${agentName}`)
        }
        refreshNotifications()
      } catch (error) {
        addToast(error?.message || 'Assignment failed.')
      }

      return
    }

    setFields((previous) =>
      previous.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              assignedAgentId: agentId || null,
            }
          : field,
      ),
    )

    const target = fields.find((field) => field.id === fieldId)
    const agentName = agentsById[agentId]?.name || 'Unassigned'
    if (target) {
      addToast(`${target.name} assigned to ${agentName}`)
    }
  }

  const handleCreateField = async (payload) => {
    if (API_ENABLED) {
      try {
        const createdField = await createField(payload)

        setFields((previous) => [createdField, ...previous])
        setSelectedFieldId(createdField.id)
        addToast(`Created ${createdField.name}.`)
        return createdField
      } catch (error) {
        addToast(error?.message || 'Field creation failed.')
        return null
      }

    }

    const status = getFieldStatusFromStage(payload.currentStage)
    const id = `field-${fields.length + 1}`
    const newField = {
      id,
      name: payload.name,
      cropType: payload.crop_type ?? payload.cropType,
      plantingDate: payload.plantingDate,
      currentStage: payload.currentStage,
      status,
      assignedAgentId: payload.assignedAgentId || null,
      updates: [],
      notes: [],
    }

    setFields((previous) => [newField, ...previous])
    setSelectedFieldId(id)
    addToast(`Created ${newField.name}.`)
    return newField
  }

  const handleOpenField = (fieldId) => {
    setSelectedFieldId(fieldId)
    setActivePage('detail')
  }

  const handleOpenUpdate = (fieldId) => {
    setUpdateFieldId(fieldId)
  }

  const handleSubmitUpdate = async (fieldId, payload) => {
    if (!currentUser) {
      return
    }

    if (API_ENABLED) {
      try {
        const updatedField = await updateFieldStage(fieldId, payload.stage)
        const createdNote = payload.note?.trim()
          ? await createFieldNote(fieldId, payload.note.trim())
          : null

        setFields((previous) =>
          previous.map((field) => {
            if (field.id !== fieldId) {
              return field
            }

            const update = {
              id: crypto.randomUUID(),
              by: currentUser.name,
              at: new Date().toISOString(),
              stage: payload.stage,
              status: updatedField.status,
              note: payload.note,
            }

            return {
              ...field,
              ...updatedField,
              updates: [update, ...field.updates],
              notes: createdNote ? [createdNote, ...updatedField.notes] : updatedField.notes,
            }
          }),
        )

        setRecentUpdates((previous) => [
          {
            id: crypto.randomUUID(),
            actor: currentUser.name,
            action: `updated ${fields.find((field) => field.id === fieldId)?.name || 'field'} to ${payload.stage}`,
            type: updatedField.status,
            at: new Date().toISOString(),
          },
          ...previous,
        ])

        setUpdateFieldId(null)
        addToast('Field update submitted successfully.')
        refreshNotifications()
      } catch (error) {
        addToast(error?.message || 'Unable to submit update.')
      }

      return
    }

    const status = stageToStatus[payload.stage] || 'Active'

    setFields((previous) =>
      previous.map((field) => {
        if (field.id !== fieldId) {
          return field
        }

        const update = {
          id: crypto.randomUUID(),
          by: currentUser.name,
          at: new Date().toISOString(),
          stage: payload.stage,
          status,
          note: payload.note,
        }

        const noteEntry = payload.note
          ? {
              id: crypto.randomUUID(),
              by: currentUser.name,
              at: update.at,
              text: payload.note,
            }
          : null

        return {
          ...field,
          currentStage: payload.stage,
          status,
          updates: [update, ...field.updates],
          notes: noteEntry ? [noteEntry, ...field.notes] : field.notes,
        }
      }),
    )

    setRecentUpdates((previous) => [
      {
        id: crypto.randomUUID(),
        actor: currentUser.name,
        action: `updated ${fields.find((field) => field.id === fieldId)?.name || 'field'} to ${payload.stage}`,
        type: status,
        at: new Date().toISOString(),
      },
      ...previous,
    ])

    setUpdateFieldId(null)
    addToast('Field update submitted successfully.')
  }

  const visibleFields =
    currentUser?.role === 'admin'
      ? fields
      : fields.filter((field) => String(field.assignedAgentId) === String(currentUser?.id))

  const safeSelectedField =
    selectedField && visibleFields.some((field) => field.id === selectedField.id)
      ? selectedField
      : visibleFields[0] || null

  return {
    currentUser,
    fields,
    recentUpdates,
    activePage,
    loginError,
    updateFieldId,
    modalField,
    agents,
    agentsById,
    visibleFields,
    safeSelectedField,
    toasts,
    notifications,
    unreadCount,
    notificationsLoading,
    notificationsError,
    setActivePage,
    setUpdateFieldId,
    handleLogin,
    handleLogout,
    handleAssignAgent,
    handleCreateField,
    handleOpenField,
    handleOpenUpdate,
    handleSubmitUpdate,
    dismissToast,
    refreshNotifications,
    markOneNotificationRead,
  }
}
