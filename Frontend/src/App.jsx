import { useEffect, useMemo, useState } from 'react'
import LoginPage from './pages/LoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AgentDashboardPage from './pages/AgentDashboardPage'
import FieldManagementPage from './pages/FieldManagementPage'
import FieldDetailPage from './pages/FieldDetailPage'
import AssignmentPage from './pages/AssignmentPage'
import UpdateModal from './components/UpdateModal'
import ToastStack from './components/ToastStack'
import { STAGE_PROGRESS, initialFields, initialRecentUpdates, users } from './data/mockData'
import {
  API_ENABLED,
  assignField,
  createField,
  createFieldNote,
  getCurrentUser,
  hasAccessToken,
  listFields,
  loginUser,
  logoutUser as apiLogoutUser,
  updateFieldStage,
} from './api'

const stageToStatus = {
  Harvested: 'Completed',
  Ready: 'Active',
  Growing: 'Active',
  Planted: 'At Risk',
}

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [fields, setFields] = useState(initialFields)
  const [recentUpdates, setRecentUpdates] = useState(initialRecentUpdates)
  const [activePage, setActivePage] = useState('dashboard')
  const [loginError, setLoginError] = useState('')
  const [selectedFieldId, setSelectedFieldId] = useState(initialFields[0]?.id || null)
  const [updateFieldId, setUpdateFieldId] = useState(null)
  const [toasts, setToasts] = useState([])

  const agents = useMemo(() => {
    if (!API_ENABLED) {
      return users.filter((user) => user.role === 'agent')
    }

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
  const agentsById = useMemo(() => {
    return agents.reduce((accumulator, user) => {
      accumulator[user.id] = user
      return accumulator
    }, {})
  }, [agents])

  const selectedField = fields.find((field) => field.id === selectedFieldId) || null
  const modalField = fields.find((field) => field.id === updateFieldId) || null

  const addToast = (message) => {
    const id = crypto.randomUUID()
    setToasts((previous) => [...previous, { id, message }])
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id))
    }, 3800)
  }

  useEffect(() => {
    if (!API_ENABLED || !hasAccessToken()) {
      return
    }

    let isMounted = true

    async function bootstrapSession() {
      try {
        const [user, apiFields] = await Promise.all([getCurrentUser(), listFields()])
        if (!isMounted) {
          return
        }

        setCurrentUser(user)
        setFields(apiFields)
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

  const handleLogin = async ({ email, password }) => {
    if (API_ENABLED) {
      try {
        await loginUser({
          identifier: email,
          password,
        })

        const [user, apiFields] = await Promise.all([getCurrentUser(), listFields()])

        setLoginError('')
        setCurrentUser(user)
        setFields(apiFields)
        setSelectedFieldId(apiFields[0]?.id || null)
        setActivePage('dashboard')
        addToast(`Signed in as ${user.name}`)
      } catch (error) {
        setLoginError(error?.message || 'Unable to sign in. Please verify credentials and backend availability.')
      }

      return
    }

    const matched = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
    )

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

  const handleCreateField = async () => {
    if (API_ENABLED) {
      try {
        const now = new Date().toISOString().slice(0, 10)
        const createdField = await createField({
          name: `New Plot ${fields.length + 1}`,
          cropType: 'Cassava',
          plantingDate: now,
          currentStage: 'Planted',
          assignedAgentId: null,
        })

        setFields((previous) => [createdField, ...previous])
        setSelectedFieldId(createdField.id)
        addToast('New field created.')
      } catch (error) {
        addToast(error?.message || 'Field creation failed.')
      }

      return
    }

    const now = new Date().toISOString().slice(0, 10)
    const id = `field-${fields.length + 1}`
    const newField = {
      id,
      name: `New Plot ${fields.length + 1}`,
      cropType: 'Cassava',
      plantingDate: now,
      currentStage: 'Planted',
      status: 'At Risk',
      assignedAgentId: null,
      updates: [],
      notes: [],
    }

    setFields((previous) => [newField, ...previous])
    setSelectedFieldId(id)
    addToast('New field created. Assign an agent to start tracking.')
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

  const navItems =
    currentUser?.role === 'admin'
      ? [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'management', label: 'Field Management' },
          { id: 'detail', label: 'Field Detail' },
          { id: 'assignment', label: 'User / Assignment' },
        ]
      : [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'management', label: 'Field Management' },
          { id: 'detail', label: 'Field Detail' },
        ]

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} loginError={loginError} />
  }

  const visibleFields =
    currentUser.role === 'admin'
      ? fields
      : fields.filter((field) => String(field.assignedAgentId) === String(currentUser.id))

  const safeSelectedField =
    selectedField && visibleFields.some((field) => field.id === selectedField.id)
      ? selectedField
      : visibleFields[0] || null

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 border-b border-outline-variant/20 bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-on-surface-variant">SmartSeason</p>
            <p className="text-lg font-bold tracking-tight text-on-surface font-headline">
              {currentUser.role === 'admin' ? 'Coordinator Console' : 'Agent Console'}
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  activePage === item.id
                    ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-on-surface">{currentUser.name}</p>
              <p className="text-xs uppercase tracking-wide text-on-surface-variant">{currentUser.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-surface-container-low px-3 py-2 text-sm font-semibold text-on-surface"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {activePage === 'dashboard' && currentUser.role === 'admin' ? (
          <AdminDashboardPage
            fields={fields}
            recentUpdates={recentUpdates.slice(0, 4)}
            agentsById={agentsById}
            onOpenField={handleOpenField}
            onOpenUpdate={handleOpenUpdate}
          />
        ) : null}

        {activePage === 'dashboard' && currentUser.role === 'agent' ? (
          <AgentDashboardPage
            fields={fields}
            currentUser={currentUser}
            onQuickUpdate={handleOpenUpdate}
            onOpenField={handleOpenField}
          />
        ) : null}

        {activePage === 'management' ? (
          <FieldManagementPage
            fields={visibleFields}
            agents={agents}
            agentsById={agentsById}
            userRole={currentUser.role}
            onCreateField={handleCreateField}
            onAssignAgent={handleAssignAgent}
            onOpenUpdate={handleOpenUpdate}
            onOpenField={handleOpenField}
          />
        ) : null}

        {activePage === 'detail' ? (
          <FieldDetailPage
            field={safeSelectedField}
            assignedAgentName={agentsById[safeSelectedField?.assignedAgentId]?.name}
            onQuickUpdate={handleOpenUpdate}
          />
        ) : null}

        {activePage === 'assignment' && currentUser.role === 'admin' ? (
          <AssignmentPage
            fields={fields}
            agents={agents}
            agentsById={agentsById}
            onAssignAgent={handleAssignAgent}
          />
        ) : null}
      </main>

      <UpdateModal
        field={modalField}
        isOpen={Boolean(updateFieldId)}
        onClose={() => setUpdateFieldId(null)}
        onSubmit={handleSubmitUpdate}
      />

      <ToastStack
        toasts={toasts}
        onDismiss={(id) => setToasts((previous) => previous.filter((toast) => toast.id !== id))}
      />
    </div>
  )
}

export default App
